"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isPromoActive, site } from "@/lib/site";

const DISMISS_KEY = "df-halloween-dismissed";

/** Site-wide seasonal promo bar. Auto-hides after site.promo.endsOn. */
export function HalloweenBanner() {
  const [hidden, setHidden] = useState(true);

  // Only show after mount: respect the promo end date (per viewer's clock)
  // and a previous dismissal (per browser).
  useEffect(() => {
    if (!isPromoActive()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) !== "1") setHidden(false);
    } catch {
      setHidden(false);
    }
  }, []);

  if (hidden) return null;

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
