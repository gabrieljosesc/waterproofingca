"use client";

import Script from "next/script";
import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/analytics";

/**
 * GA4 + Google Ads gtag — init only.
 *
 * This tiny snippet runs before hydration so `window.gtag` and the config
 * commands exist from the first moment; anything the site pushes is queued
 * in `dataLayer`. The gtag.js library itself is loaded by
 * DeferredTagLoader on first interaction (or after a few seconds idle) and
 * drains that queue when it arrives, so page views and conversions are
 * still recorded.
 */
export function GoogleTag() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <Script id="gtag-init" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
        ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
      `}
    </Script>
  );
}
