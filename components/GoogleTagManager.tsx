import Script from "next/script";
import { GTM_ID } from "@/lib/analytics";

/**
 * Google Tag Manager container — init only. Pushes the `gtm.start` event
 * Google's snippet expects; the container script itself is loaded by
 * DeferredTagLoader on first interaction (or after a few seconds idle).
 * Tags in the container still fire, a few seconds later than with
 * Google's stock snippet, and share `dataLayer` with the GA4/Ads gtag.
 */
export function GoogleTagManagerScript() {
  if (!GTM_ID) return null;
  return (
    <Script id="gtm-start" strategy="afterInteractive">
      {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`}
    </Script>
  );
}

/** The <noscript> fallback Google asks for immediately after <body>. */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
