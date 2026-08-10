import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { appBaseUrl, ownerAlertAddress, sendEmail } from "@/lib/email/resend";
import { quoteAcceptedEmail } from "@/lib/email/templates";
import { DEPOSIT_PERCENT, SHOW_PRICE_MIN_CONFIDENCE } from "@/lib/estimate/constants";
import { parseDepositCard } from "@/lib/card/parse";
import { sealCard } from "@/lib/card/vault";
import {
  readDepositCard,
  withDepositCard,
  type DepositCardMeta,
} from "@/lib/card/depositCard";

/**
 * Customer accepts their instant estimate, submits card details for the
 * refundable 20% deposit, and reserves a priority slot.
 *
 * Plain card number / CVV are never saved in the database. We store only
 * name, brand, last4, and expiry on the estimate; the full number is sealed
 * briefly so the owner can reveal it in /admin/[id], charge their terminal,
 * then wipe it when they mark the deposit collected.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured." }, { status: 503 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Card details are required to reserve your slot." },
      { status: 400 }
    );
  }

  const parsed = parseDepositCard(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
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

  const existingCard = readDepositCard(estimate.owner_adjustments);

  // Idempotent: already accepted with a card on file — do not re-seal.
  if (estimate.customer_accepted_at && existingCard) {
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

  let vault: string;
  try {
    vault = sealCard({ pan: parsed.card.pan, cvv: parsed.card.cvv });
  } catch (err) {
    console.error("[accept] vault seal failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Could not secure your card details. Please try again." },
      { status: 500 }
    );
  }

  const depositCard: DepositCardMeta = {
    name_on_card: parsed.card.nameOnCard,
    brand: parsed.card.brand,
    last4: parsed.card.last4,
    exp_month: parsed.card.expMonth,
    exp_year: parsed.card.expYear,
    captured_at: new Date().toISOString(),
    vault,
  };

  const { error: upErr } = await supabase
    .from("submission_estimates")
    .update({
      customer_accepted_at: estimate.customer_accepted_at ?? new Date().toISOString(),
      deposit_percent: DEPOSIT_PERCENT,
      deposit_low: depositLow,
      deposit_high: depositHigh,
      owner_adjustments: withDepositCard(estimate.owner_adjustments, depositCard),
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

  // Owner alert — never include full PAN / CVV. Reveal is admin-UI only.
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
    cardBrand: parsed.card.brand,
    cardLast4: parsed.card.last4,
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
