import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How DryFort Waterproofing collects, uses, stores and protects your information — including the photos you submit for estimates and how AI analysis works.",
};

const UPDATED = "August 2026";

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container legal">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Privacy Policy
        </div>
        <span className="eyebrow">Legal</span>
        <h1 className="section-title">Privacy Policy</h1>
        <p className="legal__updated">Last updated: {UPDATED}</p>

        <h2>What this covers</h2>
        <p>
          This policy explains what information {site.name} (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) collects when you use this website — including our
          photo-estimate tool — and how we use, store and protect it. By using
          the site or submitting a request, you agree to this policy.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Contact details</strong> — your name, email address, phone
            number and preferred contact method, when you submit a quote or
            estimate request.
          </li>
          <li>
            <strong>Property details</strong> — address, city, postal code,
            property type, approximate age, basement depth, where water is
            entering, and similar details you provide about the job.
          </li>
          <li>
            <strong>Photos</strong> — images of your property that you choose to
            upload for an estimate. Please do not include people in your photos;
            we only need the building, ground and problem areas.
          </li>
        </ul>
        <p>
          <strong>
            We do not collect, transmit, or store credit card, debit card, or
            other payment information through this website
          </strong>
          , including when you accept an estimate. If a deposit is required to
          reserve your project, our team collects it directly by phone using
          our own secure payment terminal — never through a web form. We also
          do not use advertising or tracking cookies.
        </p>

        <h2>How we use your information</h2>
        <ul>
          <li>To prepare and send you a waterproofing estimate.</li>
          <li>
            To contact you about your request, by the method you selected.
          </li>
          <li>To schedule assessments and perform the work you hire us for.</li>
        </ul>
        <p>
          We do not sell, rent or trade your personal information. We do not use
          your information for third-party marketing.
        </p>

        <h2>AI analysis of your photos</h2>
        <p>
          The photos you upload are analyzed by an artificial-intelligence
          service (provided by Anthropic) that identifies visible site
          conditions — for example ground surfaces, equipment access and
          obstructions — to produce your instant estimate range.{" "}
          <strong>
            An instant estimate is preliminary only; the final price is always
            confirmed by our team at an on-site visit
          </strong>
          . Photos are transmitted securely to the AI provider for this analysis
          and are not used by us to train AI models.
        </p>

        <h2>Where your information is stored</h2>
        <p>
          Your request details and photos are stored securely with our hosting
          and database provider (Supabase), with access restricted to
          authorized staff. Photos live in private storage that is not publicly
          accessible. Emails are delivered through our email provider (Resend).
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep estimate requests and photos for as long as reasonably needed
          to provide quotes, perform work, and meet legal and warranty
          record-keeping obligations. You can ask us to delete your photos or
          your entire request at any time (see below), and we will do so unless
          we are legally required to retain a record.
        </p>

        <h2>Your choices and rights</h2>
        <ul>
          <li>
            You can ask what information we hold about you, ask us to correct
            it, or ask us to delete it.
          </li>
          <li>
            To make any of these requests, contact us at{" "}
            <a href={site.emailHref}>{site.email}</a> or {site.phone}.
          </li>
        </ul>

        <h2>Changes to this policy</h2>
        <p>
          If we change this policy, we will update the date at the top of this
          page. Meaningful changes will be noted on this page.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy? Reach us at{" "}
          <a href={site.emailHref}>{site.email}</a>, {site.phone}, or{" "}
          {site.address}.
        </p>
      </div>
    </section>
  );
}
