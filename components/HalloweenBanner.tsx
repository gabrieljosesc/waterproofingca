"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isPromoActive, site } from "@/lib/site";

const DISMISS_KEY = "df-halloween-dismissed";

/**
 * Site-wide seasonal promo bar.
 *
 * Rendered on the server (so it is in the HTML from the first paint and
 * doesn't push the page down after load — that shift was costing the site
 * its Core Web Vitals score). The client only ever *hides* it: when the
 * visitor dismissed it earlier, or when the promo has passed its end date
 * on the visitor's clock. The pages are static, so after `endsOn` a
 * redeploy removes it from the HTML entirely.
 */
export function HalloweenBanner() {
  const activeAtBuild = isPromoActive();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!isPromoActive()) {
      setHidden(true);
      return;
    }
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") setHidden(true);
    } catch {
      /* storage unavailable — leave it showing */
    }
  }, []);

  if (!activeAtBuild || hidden) return null;

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="promo-bar" role="region" aria-label="Seasonal promotion">
      <Link href={site.promo.href} className="promo-bar__content">
        <span className="promo-bar__emoji" aria-hidden="true">
          {site.promo.emoji}
        </span>
        <span className="promo-bar__text">
          <strong>{site.promo.title}:</strong> {site.promo.text}
        </span>
        <span className="promo-bar__cta">{site.promo.cta} →</span>
      </Link>
      <button
        className="promo-bar__close"
        aria-label="Dismiss promotion"
        onClick={dismiss}
      >
        ✕
      </button>
    </div>
  );
}
