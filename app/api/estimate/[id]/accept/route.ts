import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { appBaseUrl, ownerAlertAddress, sendEmail } from "@/lib/email/resend";
import { quoteAcceptedEmail } from "@/lib/email/templates";
import { DEPOSIT_PERCENT, SHOW_PRICE_MIN_CONFIDENCE } from "@/lib/estimate/constants";

/**
 * Customer accepts their instant estimate and reserves a priority slot.
 *
 * No payment details are collected here or anywhere on this site — this only
 * records the acceptance and computes the refundable deposit owed. The owner
 * is alerted to call the customer and take the deposit on their own terminal
 * (see /admin/[id] for where they mark it collected).
 *
 * Public route (called from the customer-facing wizard, no auth) — but the
 * deposit and range figures are always recomputed server-side from the
 * stored estimate, never trusted from the client.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured." }, { status: 503 });
  }

  const supabase = createAdminClient();

  const [{ data: submission, error: subErr }, { data: estimate, error: estErr }] =
    await Promise.all([
      supabase.from("estimate_submissions").select("*").eq("id", id).single(),
      supabase
        .from("submission_estimates")
        .select("*")
        .eq("submission_id", id)
        .maybeSingle(),
    ]);
  if (subErr || !submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }
  if (estErr || !estimate || estimate.range_low == null || estimate.range_high == null) {
    return NextResponse.json(
      { error: "No estimate available to accept yet." },
      { status: 400 }
    );
  }
  if ((estimate.ai_confidence ?? 0) < SHOW_PRICE_MIN_CONFIDENCE) {
    return NextResponse.json(
      { error: "This estimate needs a site visit before it can be accepted." },
      { status: 400 }
    );
  }

  // Idempotent: if already accepted, just return the existing deposit figures
  // rather than erroring or re-sending the owner alert.
  if (estimate.customer_accepted_at) {
    return NextResponse.json({
      ok: true,
      accepted: true,
      alreadyAccepted: true,
      depositPercent: Number(estimate.deposit_percent ?? DEPOSIT_PERCENT),
      depositLow: estimate.deposit_low,
      depositHigh: estimate.deposit_high,
    });
  }

  const depositLow = Math.round((Number(estimate.range_low) * DEPOSIT_PERCENT) / 100);
  const depositHigh = Math.round((Number(estimate.range_high) * DEPOSIT_PERCENT) / 100);

  const { error: upErr } = await supabase
    .from("submission_estimates")
    .update({
      customer_accepted_at: new Date().toISOString(),
      deposit_percent: DEPOSIT_PERCENT,
      deposit_low: depositLow,
      deposit_high: depositHigh,
    })
    .eq("submission_id", id);
  if (upErr) {
    console.error("[accept] update failed:", upErr.message);
    return NextResponse.json({ error: "Could not save your acceptance." }, { status: 500 });
  }

  await supabase
    .from("estimate_submissions")
    .update({ status: "accepted" })
    .eq("id", id);

  // Owner alert — never fatal to the customer's acceptance.
  const alert = quoteAcceptedEmail({
    name: submission.full_name,
    email: submission.email,
    phone: submission.phone,
    city: submission.city,
    service: submission.service_requested,
    rangeLow: Number(estimate.range_low),
    rangeHigh: Number(estimate.range_high),
    depositPercent: DEPOSIT_PERCENT,
    depositLow,
    depositHigh,
    dashboardUrl: `${appBaseUrl()}/admin/${id}`,
  });
  await sendEmail({
    to: ownerAlertAddress(),
    subject: alert.subject,
    html: alert.html,
    text: alert.text,
    replyTo: submission.email,
  });

  return NextResponse.json({
    ok: true,
    accepted: true,
    alreadyAccepted: false,
    depositPercent: DEPOSIT_PERCENT,
    depositLow,
    depositHigh,
  });
}
