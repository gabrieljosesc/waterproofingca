import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { CheckIcon, PhoneIcon } from "@/components/Icons";

/**
 * Confirmation page for the contact / quote request form. Has its own URL so
 * a page-load conversion tag can be attached to it. Not indexed.
 */
export const metadata: Metadata = {
  title: "Request Received",
  description: "Thanks — your quote request has been received. We'll be in touch within one business day.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="form wizard confirmation">
          <div className="wizard__done-icon">
            <CheckIcon size={28} />
          </div>
          <span className="eyebrow">Request received</span>
          <h1 className="confirmation__title">Thanks — we&apos;ve got your request</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Our team will review it and get back to you within one business day
            — or much sooner if it&apos;s urgent. If water is actively coming in
            right now, don&apos;t wait for the callback: call the 24/7 line and
            a crew can be dispatched tonight.
          </p>
          <div className="cta-band__actions" style={{ justifyContent: "flex-start", marginTop: 24 }}>
            <a href={site.phoneHref} className="btn btn--primary">
              <PhoneIcon size={18} /> Call {site.phone}
            </a>
            <Link href="/estimate" className="btn btn--ghost">
              Get an Instant Photo Estimate
            </Link>
          </div>
          <p className="form__note" style={{ marginTop: 22 }}>
            While you wait: see{" "}
            <Link href="/crack-repair-process">how we repair a leaking foundation crack</Link>
            {" "}or <Link href="/pricing">our pricing</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
