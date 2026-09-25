import Script from "next/script";
import { GTM_ID } from "@/lib/analytics";

/**
 * Google Tag Manager container loader — Google's standard snippet, split into
 * the two pieces it asks for. Rendered once from the root layout so it is on
 * every page.
 *
 * It shares the `dataLayer` array with the GA4/Ads gtag in GoogleTag.tsx, so
 * events the site pushes (generate_lead, conversion) are visible to tags the
 * ads team builds inside the container too.
 */
export function GoogleTagManagerScript() {
  if (!GTM_ID) return null;
  return (
    <Script id="gtm-loader" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
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
