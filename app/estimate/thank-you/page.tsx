import type { Metadata } from "next";
import { Suspense } from "react";
import { EstimateResult } from "@/components/estimate/EstimateResult";

/**
 * Where the estimate wizard lands after a submission. Shows the instant
 * estimate (or the "needs a closer look" / generic confirmation) for the
 * submission in `?id=`. Has its own URL so a page-load conversion tag can be
 * attached to it. Not indexed.
 */
export const metadata: Metadata = {
  title: "Your Instant Estimate",
  description: "Your DryFort instant waterproofing estimate.",
  robots: { index: false, follow: false },
};

export default function EstimateThankYouPage() {
  return (
    <section className="section">
      <div className="container">
        <Suspense fallback={<div className="form wizard confirmation" />}>
          <EstimateResult />
        </Suspense>
      </div>
    </section>
  );
}
