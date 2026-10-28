import Script from "next/script";
import { GTM_ID } from "@/lib/analytics";

/**
 * Google Tag Manager container loader. Rendered once from the root layout
 * so it is on every page.
 *
 * Google's stock snippet injects gtm.js immediately, which on this site
 * blocked the main thread for ~2 s on phones. Here the `gtm.start` event
 * is pushed right away (so GTM's own timing is correct) but the 150 KB
 * container script loads lazily after the page is interactive. Tags in the
 * container still fire — a few seconds later than before — and share the
 * same `dataLayer` as the GA4/Ads gtag in GoogleTag.tsx.
 */
export function GoogleTagManagerScript() {
  if (!GTM_ID) return null;
  return (
    <>
      <Script id="gtm-start" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`}
      </Script>
      <Script
        id="gtm-loader"
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        strategy="lazyOnload"
      />
    </>
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
