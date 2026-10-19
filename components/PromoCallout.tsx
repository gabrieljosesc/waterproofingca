"use client";

import { useEffect, useState } from "react";
import { isPromoActive, site } from "@/lib/site";

/** Inline seasonal-promo note (contact + estimate pages). Auto-hides after endsOn. */
export function PromoCallout() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isPromoActive());
  }, []);

  if (!show) return null;

  return (
    <div className="promo-callout">
      <span aria-hidden="true">{site.promo.emoji}</span>
      <span>
        <strong>{site.promo.title}:</strong> {site.promo.text}
      </span>
    </div>
  );
}
