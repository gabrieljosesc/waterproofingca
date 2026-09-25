"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckIcon, PhoneIcon } from "@/components/Icons";
import { site } from "@/lib/site";
import { consumePendingConversion, trackQuoteAccepted } from "@/lib/analytics";
import type { EstimateSummary } from "@/components/estimate/EstimateResult";

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");

export function QuoteAcceptedView() {
  const id = useSearchParams().get("id");
  const [summary, setSummary] = useState<EstimateSummary | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    fetch(`/api/estimate/${id}/summary`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json?.hasEstimate) return;
        setSummary(json.estimate as EstimateSummary);
        if (consumePendingConversion("accept", id)) {
          trackQuoteAccepted(json.estimate.depositLow ?? 0);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="form wizard confirmation">
      <div className="wizard__done-icon">
        <CheckIcon size={28} />
      </div>
      <span className="eyebrow">Estimate accepted</span>
      <h1 className="confirmation__title">You&apos;re reserved!</h1>
      <p style={{ color: "var(--text-muted)" }}>
        {summary ? (
          <>
            Your {summary.depositPercent}% refundable deposit (
            {money(summary.depositLow)} – {money(summary.depositHigh)}) is ready
            to process and your priority slot is locked in.{" "}
          </>
        ) : (
          <>Your refundable deposit is ready to process and your priority slot is locked in. </>
        )}
        This is still a preliminary estimate — final pricing is confirmed at
        your free on-site visit. We&apos;ll be in touch within one business
        day to book it.
      </p>
      <div className="cta-band__actions" style={{ justifyContent: "flex-start", marginTop: 24 }}>
        <a href={site.phoneHref} className="btn btn--primary">
          <PhoneIcon size={18} /> Call {site.phone}
        </a>
        <Link href="/" className="btn btn--ghost">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
