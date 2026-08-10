/** Card number helpers — brand detection, Luhn check, field sanitizing.
 *  Full PAN never lands in the database in plain text; only these helpers
 *  shape what we keep (last4 / brand / exp) and what we seal in the vault. */

export type CardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "unknown";

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function detectBrand(pan: string): CardBrand {
  const d = digitsOnly(pan);
  if (/^3[47]\d{13}$/.test(d)) return "amex";
  if (/^4\d{12,18}$/.test(d)) return "visa";
  if (
    /^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7[01]\d{12}|720\d{12}))$/.test(d)
  ) {
    return "mastercard";
  }
  if (/^6(?:011|5\d{2})\d{12}$/.test(d)) return "discover";
  return "unknown";
}

export function brandLabel(brand: CardBrand): string {
  switch (brand) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "American Express";
    case "discover":
      return "Discover";
    default:
      return "Card";
  }
}

/** Luhn checksum — rejects obvious typos before we accept a deposit card. */
export function luhnOk(pan: string): boolean {
  const d = digitsOnly(pan);
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = Number(d[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export interface ParsedDepositCard {
  nameOnCard: string;
  pan: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  cvv: string;
}

export function parseDepositCard(input: {
  nameOnCard?: unknown;
  cardNumber?: unknown;
  expMonth?: unknown;
  expYear?: unknown;
  cvv?: unknown;
}): { ok: true; card: ParsedDepositCard } | { ok: false; error: string } {
  const nameOnCard = String(input.nameOnCard ?? "")
    .trim()
    .replace(/\s+/g, " ");
  if (nameOnCard.length < 2 || nameOnCard.length > 80) {
    return { ok: false, error: "Enter the name as it appears on the card." };
  }

  const pan = digitsOnly(String(input.cardNumber ?? ""));
  if (!luhnOk(pan)) {
    return { ok: false, error: "Enter a valid card number." };
  }

  const expMonth = Number(input.expMonth);
  const expYearRaw = Number(input.expYear);
  if (
    !Number.isInteger(expMonth) ||
    expMonth < 1 ||
    expMonth > 12 ||
    !Number.isInteger(expYearRaw)
  ) {
    return { ok: false, error: "Enter a valid expiry date." };
  }
  const expYear = expYearRaw < 100 ? 2000 + expYearRaw : expYearRaw;
  const now = new Date();
  const ymNow = now.getFullYear() * 12 + now.getMonth(); // month 0-based
  const ymCard = expYear * 12 + (expMonth - 1);
  if (ymCard < ymNow) {
    return { ok: false, error: "This card looks expired." };
  }

  const brand = detectBrand(pan);
  const cvv = digitsOnly(String(input.cvv ?? ""));
  const cvvLen = brand === "amex" ? 4 : 3;
  if (cvv.length !== cvvLen) {
    return {
      ok: false,
      error: brand === "amex" ? "Enter the 4-digit CVV." : "Enter the 3-digit CVV.",
    };
  }

  return {
    ok: true,
    card: {
      nameOnCard,
      pan,
      brand,
      last4: pan.slice(-4),
      expMonth,
      expYear,
      cvv,
    },
  };
}
