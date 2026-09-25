import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteAcceptedView } from "@/components/estimate/QuoteAcceptedView";

/**
 * Where the customer lands after accepting their instant estimate. Has its own
 * URL so a page-load conversion tag can be attached to it. Not indexed.
 */
export const metadata: Metadata = {
  title: "Your Spot Is Reserved",
  description: "Your DryFort estimate has been accepted and your priority slot is reserved.",
  robots: { index: false, follow: false },
};

export default function QuoteAcceptedPage() {
  return (
    <section className="section">
      <div className="container">
        <Suspense fallback={<div className="form wizard confirmation" />}>
          <QuoteAcceptedView />
        </Suspense>
      </div>
    </section>
  );
}
