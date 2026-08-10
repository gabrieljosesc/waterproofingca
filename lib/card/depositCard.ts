import type { Json } from "@/lib/supabase/types";
import type { CardBrand } from "@/lib/card/parse";

/** Shape stored under submission_estimates.owner_adjustments.deposit_card.
 *  `vault` is ciphertext only and is cleared after the deposit is collected. */
export interface DepositCardMeta {
  name_on_card: string;
  brand: CardBrand;
  last4: string;
  exp_month: number;
  exp_year: number;
  captured_at: string;
  /** AES-GCM ciphertext of { pan, cvv }. Null once wiped. */
  vault: string | null;
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function readDepositCard(ownerAdjustments: unknown): DepositCardMeta | null {
  const root = asRecord(ownerAdjustments);
  const raw = asRecord(root.deposit_card);
  if (
    typeof raw.name_on_card !== "string" ||
    typeof raw.last4 !== "string" ||
    typeof raw.exp_month !== "number" ||
    typeof raw.exp_year !== "number"
  ) {
    return null;
  }
  return {
    name_on_card: raw.name_on_card,
    brand: (typeof raw.brand === "string" ? raw.brand : "unknown") as CardBrand,
    last4: raw.last4,
    exp_month: raw.exp_month,
    exp_year: raw.exp_year,
    captured_at:
      typeof raw.captured_at === "string"
        ? raw.captured_at
        : new Date().toISOString(),
    vault: typeof raw.vault === "string" ? raw.vault : null,
  };
}

/** Merge deposit_card into owner_adjustments without dropping other keys
 *  (e.g. approval notes from send-estimate). */
export function withDepositCard(
  ownerAdjustments: unknown,
  card: DepositCardMeta | null
): Json {
  const root = asRecord(ownerAdjustments);
  if (!card) {
    const { deposit_card: _drop, ...rest } = root;
    void _drop;
    return rest as unknown as Json;
  }
  return { ...root, deposit_card: card } as unknown as Json;
}

/** Clear only the sealed vault; keep last4 / brand for the record. */
export function wipeDepositCardVault(ownerAdjustments: unknown): Json {
  const existing = readDepositCard(ownerAdjustments);
  if (!existing) return asRecord(ownerAdjustments) as unknown as Json;
  return withDepositCard(ownerAdjustments, { ...existing, vault: null });
}
