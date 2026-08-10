import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

/**
 * Short-lived sealed card payload for admin reveal only.
 *
 * Plain PAN / CVV are never written to Postgres. We store AES-256-GCM
 * ciphertext in JSON (`owner_adjustments.deposit_card.vault`) so the owner
 * dashboard can decrypt once via a server route, charge the 20% deposit on
 * their terminal, then wipe the vault when they mark the deposit collected.
 */

export interface SealedCardPayload {
  pan: string;
  cvv: string;
}

function vaultKey(): Buffer {
  const secret =
    process.env.CARD_VAULT_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!secret) {
    throw new Error("CARD_VAULT_SECRET (or SUPABASE_SERVICE_ROLE_KEY) is required.");
  }
  return createHash("sha256").update(secret).digest();
}

/** Seal PAN + CVV → base64(iv || tag || ciphertext). */
export function sealCard(payload: SealedCardPayload): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", vaultKey(), iv);
  const plain = Buffer.from(JSON.stringify(payload), "utf8");
  const enc = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

export function openCard(sealed: string): SealedCardPayload {
  const buf = Buffer.from(sealed, "base64");
  if (buf.length < 12 + 16 + 1) {
    throw new Error("Invalid sealed card payload.");
  }
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", vaultKey(), iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(enc), decipher.final()]);
  const parsed = JSON.parse(plain.toString("utf8")) as SealedCardPayload;
  if (
    typeof parsed.pan !== "string" ||
    typeof parsed.cvv !== "string" ||
    !/^\d{13,19}$/.test(parsed.pan) ||
    !/^\d{3,4}$/.test(parsed.cvv)
  ) {
    throw new Error("Invalid sealed card payload.");
  }
  return parsed;
}
