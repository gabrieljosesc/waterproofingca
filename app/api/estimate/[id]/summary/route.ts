import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { DEPOSIT_PERCENT, SHOW_PRICE_MIN_CONFIDENCE } from "@/lib/estimate/constants";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Customer-safe read of a submission's stored instant estimate. Powers the
 * /estimate/thank-you and /estimate/accepted pages so they can be refreshed
 * or revisited without re-running (and re-billing) the AI analysis.
 *
 * Returns only what the customer already saw in the wizard — never the
 * owner's adjustments, card details, or the raw AI conditions.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const headers = { "Cache-Control": "no-store" };

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Not found." }, { status: 404, headers });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured." }, { status: 503, headers });
  }

  const supabase = createAdminClient();
  const [{ data: submission }, { data: estimate }] = await Promise.all([
    supabase
      .from("estimate_submissions")
      .select("id, rebate_city")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("submission_estimates")
      .select(
        "range_low, range_high, rebate_amount, net_low, net_high, ai_confidence, ai_conditions, engine_output, customer_accepted_at, deposit_percent, deposit_low, deposit_high"
      )
      .eq("submission_id", id)
      .maybeSingle(),
  ]);

  if (!submission) {
    return NextResponse.json({ error: "Not found." }, { status: 404, headers });
  }

  if (!estimate || estimate.range_low == null || estimate.range_high == null) {
    return NextResponse.json(
      { ok: true, hasEstimate: false, accepted: false },
      { headers }
    );
  }

  const conditions = estimate.ai_conditions as unknown as { summary?: string } | null;
  const engine = estimate.engine_output as unknown as { quoteValidDays?: number } | null;
  const rangeLow = Number(estimate.range_low);
  const rangeHigh = Number(estimate.range_high);
  const confidence = estimate.ai_confidence ?? 0;
  const depositPercent = Number(estimate.deposit_percent ?? DEPOSIT_PERCENT);

  return NextResponse.json(
    {
      ok: true,
      hasEstimate: true,
      accepted: Boolean(estimate.customer_accepted_at),
      estimate: {
        showPrice: confidence >= SHOW_PRICE_MIN_CONFIDENCE,
        rangeLow,
        rangeHigh,
        rebate: Number(estimate.rebate_amount ?? 0),
        netLow: Number(estimate.net_low ?? rangeLow),
        netHigh: Number(estimate.net_high ?? rangeHigh),
        rebateCity: submission.rebate_city ?? null,
        summary: conditions?.summary ?? undefined,
        confidence,
        validDays: engine?.quoteValidDays ?? 30,
        depositPercent,
        depositLow:
          estimate.deposit_low ?? Math.round((rangeLow * depositPercent) / 100),
        depositHigh:
          estimate.deposit_high ?? Math.round((rangeHigh * depositPercent) / 100),
      },
    },
    { headers }
  );
}
