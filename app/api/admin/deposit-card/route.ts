import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { brandLabel } from "@/lib/card/parse";
import {
  readDepositCard,
  wipeDepositCardVault,
  withDepositCard,
} from "@/lib/card/depositCard";
import { openCard } from "@/lib/card/vault";

async function requireAdmin(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { error: NextResponse.json({ error: "Not signed in." }, { status: 401 }) };
  const supabase = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  const email = user?.email?.toLowerCase();
  if (!email) {
    return { error: NextResponse.json({ error: "Not signed in." }, { status: 401 }) };
  }
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  if (!adminRow) {
    return { error: NextResponse.json({ error: "Not authorized." }, { status: 403 }) };
  }
  return { supabase, email };
}

/**
 * GET — reveal full card details for the owner dashboard only.
 * Plain PAN is never persisted; we decrypt the short-lived vault here.
 *
 * POST — mark deposit collected / save note, and wipe the vault so the
 * full number does not remain once the terminal charge is done.
 */
export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured." }, { status: 503 });
  }
  const auth = await requireAdmin(request);
  if ("error" in auth && auth.error) return auth.error;

  const submissionId = new URL(request.url).searchParams.get("submissionId");
  if (!submissionId) {
    return NextResponse.json({ error: "submissionId is required." }, { status: 400 });
  }

  const { data: estimate, error } = await auth.supabase!
    .from("submission_estimates")
    .select("owner_adjustments, deposit_low, deposit_high, deposit_percent, deposit_collected")
    .eq("submission_id", submissionId)
    .maybeSingle();
  if (error || !estimate) {
    return NextResponse.json({ error: "Estimate not found." }, { status: 404 });
  }

  const meta = readDepositCard(estimate.owner_adjustments);
  if (!meta) {
    return NextResponse.json({ error: "No card on file for this acceptance." }, { status: 404 });
  }
  if (!meta.vault) {
    return NextResponse.json(
      {
        error:
          "Full card details were already cleared after deposit collection. Only the masked card remains.",
        masked: {
          nameOnCard: meta.name_on_card,
          brand: meta.brand,
          brandLabel: brandLabel(meta.brand),
          last4: meta.last4,
          expMonth: meta.exp_month,
          expYear: meta.exp_year,
        },
      },
      { status: 410 }
    );
  }

  try {
    const opened = openCard(meta.vault);
    return NextResponse.json({
      ok: true,
      nameOnCard: meta.name_on_card,
      brand: meta.brand,
      brandLabel: brandLabel(meta.brand),
      last4: meta.last4,
      expMonth: meta.exp_month,
      expYear: meta.exp_year,
      cardNumber: opened.pan,
      cvv: opened.cvv,
      depositPercent: Number(estimate.deposit_percent ?? 20),
      depositLow: estimate.deposit_low,
      depositHigh: estimate.deposit_high,
      depositCollected: estimate.deposit_collected,
      note: "Charge the refundable deposit on your terminal, then mark it collected — that clears the full card number.",
    });
  } catch (err) {
    console.error("[deposit-card] open failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Could not decrypt card details." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured." }, { status: 503 });
  }
  const auth = await requireAdmin(request);
  if ("error" in auth && auth.error) return auth.error;

  let body: {
    submissionId?: string;
    collected?: boolean;
    note?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body.submissionId) {
    return NextResponse.json({ error: "submissionId is required." }, { status: 400 });
  }

  const { data: estimate, error } = await auth.supabase!
    .from("submission_estimates")
    .select("owner_adjustments")
    .eq("submission_id", body.submissionId)
    .maybeSingle();
  if (error || !estimate) {
    return NextResponse.json({ error: "Estimate not found." }, { status: 404 });
  }

  const collected = Boolean(body.collected);
  // When marking collected, wipe the sealed PAN/CVV. Undo keeps metadata only.
  const nextAdjustments = collected
    ? wipeDepositCardVault(estimate.owner_adjustments)
    : withDepositCard(
        estimate.owner_adjustments,
        readDepositCard(estimate.owner_adjustments)
      );

  const { error: upErr } = await auth.supabase!
    .from("submission_estimates")
    .update({
      deposit_collected: collected,
      deposit_collected_at: collected ? new Date().toISOString() : null,
      deposit_note: body.note?.trim() || null,
      owner_adjustments: nextAdjustments,
    })
    .eq("submission_id", body.submissionId);

  if (upErr) {
    console.error("[deposit-card] update failed:", upErr.message);
    return NextResponse.json({ error: "Could not update deposit." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    collected,
    vaultCleared: collected,
  });
}
