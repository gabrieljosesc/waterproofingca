import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/resend";
import { customerEstimateEmail } from "@/lib/email/templates";
import { RATE_CONFIG } from "@/lib/pricing";
import type { Json } from "@/lib/supabase/types";

/**
 * Approve an estimate and email it to the customer.
 *
 * Called from the owner dashboard with the owner's session JWT. The service
 * role does the writing, so this route must verify the caller is an allowlisted
 * admin itself (the same admin_users allowlist RLS uses).
 *
 * Statuses: approve saves the final range (estimate → approved); a successful
 * customer email advances both rows to `sent`. If email isn't configured or
 * fails, the approval still stands and the response says the email didn't go
 * out, so the owner can send it manually.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured." }, { status: 503 });
  }

  // --- Auth: bearer JWT must belong to an allowlisted admin ---
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const supabase = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  const email = user?.email?.toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  if (!adminRow) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  // --- Input ---
  let body: {
    submissionId?: string;
    finalLow?: number;
    finalHigh?: number;
    note?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const submissionId = String(body.submissionId ?? "").trim();
  const finalLow = Number(body.finalLow);
  const finalHigh = Number(body.finalHigh);
  if (
    !submissionId ||
    !Number.isFinite(finalLow) ||
    !Number.isFinite(finalHigh) ||
    finalLow <= 0 ||
    finalHigh < finalLow
  ) {
    return NextResponse.json(
      { error: "A valid submission id and final range (low ≤ high) are required." },
      { status: 400 }
    );
  }

  // --- Load submission + estimate ---
  const [{ data: submission }, { data: estimate }] = await Promise.all([
    supabase.from("estimate_submissions").select("*").eq("id", submissionId).single(),
    supabase
      .from("submission_estimates")
      .select("*")
      .eq("submission_id", submissionId)
      .maybeSingle(),
  ]);
  if (!submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }
  if (!estimate) {
    return NextResponse.json(
      { error: "No estimate exists for this submission yet." },
      { status: 400 }
    );
  }

  // --- Approve: save the final range (merge adjustments so deposit card meta stays) ---
  const prevAdj =
    estimate.owner_adjustments &&
    typeof estimate.owner_adjustments === "object" &&
    !Array.isArray(estimate.owner_adjustments)
      ? (estimate.owner_adjustments as Record<string, unknown>)
      : {};
  const nextAdj = {
    ...prevAdj,
    approved_by: email,
    ...(body.note?.trim() ? { note: body.note.trim() } : {}),
  };

  const { error: approveErr } = await supabase
    .from("submission_estimates")
    .update({
      status: "approved",
      final_low: finalLow,
      final_high: finalHigh,
      owner_adjustments: nextAdj as unknown as Json,
    })
    .eq("submission_id", submissionId);
  if (approveErr) {
    console.error("[send-estimate] approve failed:", approveErr.message);
    return NextResponse.json({ error: "Could not save the approval." }, { status: 500 });
  }
  await supabase
    .from("estimate_submissions")
    .update({ status: "approved" })
    .eq("id", submissionId);

  // --- Email the customer ---
  const rebateAmount = Number(estimate.rebate_amount ?? 0);
  const message = customerEstimateEmail({
    name: submission.full_name,
    service: submission.service_requested,
    linearFeet: submission.linear_feet ? Number(submission.linear_feet) : null,
    finalLow,
    finalHigh,
    rebateAmount: rebateAmount > 0 ? rebateAmount : 0,
    rebateCity: submission.rebate_city,
    validDays: RATE_CONFIG.quoteValidDays,
  });
  const result = await sendEmail({
    to: submission.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  if (!result.sent) {
    return NextResponse.json({
      ok: true,
      approved: true,
      emailed: false,
      warning: `Approved, but the email did not go out (${result.error ?? "unknown"}). Send it to ${submission.email} manually.`,
    });
  }

  await Promise.all([
    supabase
      .from("submission_estimates")
      .update({ status: "sent" })
      .eq("submission_id", submissionId),
    supabase
      .from("estimate_submissions")
      .update({ status: "sent" })
      .eq("id", submissionId),
  ]);

  return NextResponse.json({ ok: true, approved: true, emailed: true });
}
