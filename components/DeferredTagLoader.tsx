"use client";

import { useEffect } from "react";
import { GA_MEASUREMENT_ID, GTM_ID } from "@/lib/analytics";

/**
 * Loads the heavy Google scripts (gtag.js for GA4/Ads, the GTM container)
 * on the first user interaction — or after a short idle delay if the
 * visitor hasn't touched anything — instead of during page load.
 *
 * Why: together they cost ~500 KB and 1.5–2 s of main-thread time on a
 * phone, which was most of the site's Core Web Vitals penalty. Nothing is
 * lost: `window.gtag` and `dataLayer` exist from the first paint (see
 * GoogleTag.tsx), so page views, GA4 events and the thank-you-page
 * conversions are queued and sent as soon as the libraries arrive.
 */
const IDLE_DELAY_MS = 4000;
const EVENTS = ["scroll", "pointerdown", "keydown", "touchstart", "mousemove"] as const;

function inject(src: string, id: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = true;
  document.head.appendChild(s);
}

export function DeferredTagLoader() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID && !GTM_ID) return;
    let done = false;

    const load = () => {
      if (done) return;
      done = true;
      cleanup();
      if (GA_MEASUREMENT_ID) {
        inject(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`, "gtag-js");
      }
      if (GTM_ID) {
        inject(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`, "gtm-js");
      }
    };

    const timer = window.setTimeout(load, IDLE_DELAY_MS);
    const cleanup = () => {
      window.clearTimeout(timer);
      for (const ev of EVENTS) window.removeEventListener(ev, load);
    };
    for (const ev of EVENTS) window.addEventListener(ev, load, { passive: true, once: true });
    return cleanup;
  }, []);

  return null;
}
