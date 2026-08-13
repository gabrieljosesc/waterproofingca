/**
 * Google Analytics 4 + Google Ads conversion tracking. Everything here is a
 * no-op until NEXT_PUBLIC_GA_MEASUREMENT_ID is set — see .env.example.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
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
