/**
 * Google Analytics 4 + Google Ads conversion tracking. Everything here is a
 * no-op until NEXT_PUBLIC_GA_MEASUREMENT_ID is set — see .env.example.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * Google Tag Manager container, managed by the client's ads team. The
 * container ID is public (it's in the page source of every site that uses
 * GTM), so it's fixed here rather than behind an env var; set
 * NEXT_PUBLIC_GTM_ID to override, or to "" to turn it off.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-WDWLLDVW";
const ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;
const ADS_ACCEPT_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_ACCEPT_LABEL;

export function isAnalyticsConfigured() {
  return Boolean(GA_MEASUREMENT_ID);
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

/**
 * Conversions fire on the confirmation pages (/thank-you, /estimate/thank-you,
 * /estimate/accepted) rather than in the form itself, so a full-page redirect
 * can't drop the hit and so URL-based conversion tags work too. The form marks
 * the conversion as pending right before it redirects; the confirmation page
 * consumes the mark on load and fires exactly once — a refresh or a revisit
 * of the same URL won't count it again.
 */
export type PendingConversion = "lead" | "accept";

function pendingKey(kind: PendingConversion) {
  return `df_pending_${kind}`;
}

export function markPendingConversion(kind: PendingConversion, id: string) {
  try {
    window.sessionStorage.setItem(pendingKey(kind), id);
  } catch {
    // storage unavailable (private mode etc.) — the conversion is simply not tracked
  }
}

/** True (once) if the given conversion was marked pending for this id. */
export function consumePendingConversion(kind: PendingConversion, id: string) {
  try {
    const key = pendingKey(kind);
    const pending = window.sessionStorage.getItem(key);
    if (pending !== id) return false;
    window.sessionStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/** Fires when a customer submits the estimate wizard — a new lead. */
export function trackLeadSubmitted() {
  gtag("event", "generate_lead", { currency: "CAD" });
  if (GOOGLE_ADS_ID && ADS_LEAD_LABEL) {
    gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${ADS_LEAD_LABEL}`,
    });
  }
}

/** Fires when a customer accepts their instant estimate and reserves a slot — the highest-value conversion. */
export function trackQuoteAccepted(value: number) {
  gtag("event", "generate_lead", { currency: "CAD", value });
  if (GOOGLE_ADS_ID && ADS_ACCEPT_LABEL) {
    gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${ADS_ACCEPT_LABEL}`,
      value,
      currency: "CAD",
    });
  }
}
