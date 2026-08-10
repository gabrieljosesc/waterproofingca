import { NextResponse } from "next/server";
import {
  createAdminClient,
  isSupabaseConfigured,
  SUBMISSION_PHOTO_BUCKET,
} from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";
import { isAiConfigured } from "@/lib/ai/client";
import { analyzePhotos, type PhotoInput } from "@/lib/ai/vision";
import { conditionsToInput } from "@/lib/estimate/conditionsToInput";
import { calculateEstimate } from "@/lib/pricing";

const MAX_PHOTOS = 12; // cap AI cost per submission

/** Below this AI confidence we don't show the customer a number — the site
 *  visit does the talking instead (per the client's own spec: <50% → no
 *  automatic price). */
const SHOW_PRICE_MIN_CONFIDENCE = 50;

// Photo downloads + the AI call can exceed Vercel's default function window.
export const maxDuration = 60;

function mediaTypeFor(path: string): PhotoInput["mediaType"] {
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

/**
 * Run AI analysis on a submission's photos, price it with the engine, and store
 * the estimate. The response includes a customer-safe instant estimate (shown
 * directly in the wizard, per the client's decision): the range, the AI's
 * observations, and whether the number is confident enough to display at all.
 * The owner still gets the lead alert and the dashboard record for the
 * site-visit follow-up. Idempotent per submission (the estimate row is
 * upserted).
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured." }, { status: 503 });
  }
  if (!isAiConfigured()) {
    return NextResponse.json(
      { ok: true, analyzed: false, reason: "AI not configured" }
    );
  }

  const supabase = createAdminClient();

  const { data: submission, error: subErr } = await supabase
    .from("estimate_submissions")
    .select("*")
    .eq("id", id)
    .single();
  if (subErr || !submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  const { data: photos, error: photoErr } = await supabase
    .from("submission_photos")
    .select("storage_path")
    .eq("submission_id", id)
    .limit(MAX_PHOTOS);
  if (photoErr) {
    return NextResponse.json({ error: "Could not load photos." }, { status: 500 });
  }
  if (!photos || photos.length === 0) {
    return NextResponse.json(
      { error: "No photos to analyze for this submission." },
      { status: 400 }
    );
  }

  // Download each photo from the private bucket and base64-encode it.
  const images: PhotoInput[] = [];
  for (const p of photos) {
    const { data: blob, error: dlErr } = await supabase.storage
      .from(SUBMISSION_PHOTO_BUCKET)
      .download(p.storage_path);
    if (dlErr || !blob) {
      console.error("[analyze] download failed:", p.storage_path, dlErr?.message);
      continue;
    }
    const buffer = Buffer.from(await blob.arrayBuffer());
    images.push({
      base64: buffer.toString("base64"),
      mediaType: mediaTypeFor(p.storage_path),
    });
  }
  if (images.length === 0) {
    return NextResponse.json({ error: "Could not read any photos." }, { status: 500 });
  }

  // AI reads the photos into structured conditions.
  let conditions;
  try {
    conditions = await analyzePhotos(images);
  } catch (err) {
    console.error("[analyze] AI call failed:", err);
    return NextResponse.json({ error: "AI analysis failed." }, { status: 502 });
  }

  // Map conditions + intake into a pricing-engine input, then price it.
  const { input, warnings } = conditionsToInput(submission, conditions);
  const estimate = calculateEstimate(input);

  // Store the draft for owner review.
  const { error: upErr } = await supabase.from("submission_estimates").upsert(
    {
      submission_id: id,
      status: "owner_review",
      ai_conditions: { ...conditions, mapping_warnings: warnings } as unknown as Json,
      ai_confidence: conditions.overall_confidence,
      engine_input: input as unknown as Json,
      engine_output: estimate as unknown as Json,
      range_low: estimate.rangeLow,
      range_high: estimate.rangeHigh,
      rebate_amount: estimate.rebate.estimatedRebate,
      net_low: estimate.netAfterRebateLow,
      net_high: estimate.netAfterRebateHigh,
    },
    { onConflict: "submission_id" }
  );
  if (upErr) {
    console.error("[analyze] estimate upsert failed:", upErr.message);
    return NextResponse.json({ error: "Could not save the estimate." }, { status: 500 });
  }

  await supabase
    .from("estimate_submissions")
    .update({ status: "ai_analyzed" })
    .eq("id", id);

  // Customer-facing instant estimate. Only show a number when the AI is
  // confident enough; otherwise the wizard shows a "needs a closer look"
  // message and the site visit does the pricing conversation.
  const showPrice =
    conditions.overall_confidence >= SHOW_PRICE_MIN_CONFIDENCE;

  return NextResponse.json({
    ok: true,
    analyzed: true,
    photos: images.length,
    aiConfidence: conditions.overall_confidence,
    rangeLow: estimate.rangeLow,
    rangeHigh: estimate.rangeHigh,
    rebate: estimate.rebate.estimatedRebate,
    warnings,
    customer: {
      showPrice,
      rangeLow: estimate.rangeLow,
      rangeHigh: estimate.rangeHigh,
      rebate: estimate.rebate.estimatedRebate,
      netLow: estimate.netAfterRebateLow,
      netHigh: estimate.netAfterRebateHigh,
      rebateCity: submission.rebate_city,
      summary: conditions.summary,
      confidence: conditions.overall_confidence,
      validDays: estimate.quoteValidDays,
    },
  });
}
