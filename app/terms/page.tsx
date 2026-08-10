import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply to DryFort Waterproofing's website and online photo-estimate tool, including how estimates work and what they do and don't guarantee.",
};

const UPDATED = "August 2026";

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container legal">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Terms of Service
        </div>
        <span className="eyebrow">Legal</span>
        <h1 className="section-title">Terms of Service</h1>
        <p className="legal__updated">Last updated: {UPDATED}</p>

        <h2>About these terms</h2>
        <p>
          These terms apply to the {site.name} website and its online
          photo-estimate tool. By using the site or submitting a request, you
          agree to them.
        </p>

        <h2>Online estimates are preliminary</h2>
        <p>
          The estimate tool provides an instant,{" "}
          <strong>preliminary price range</strong> generated with the
          assistance of artificial intelligence from the photographs,
          measurements and information you submit. An online estimate is{" "}
          <strong>not</strong> a structural assessment, engineering report,
          building inspection, drainage inspection, or a guarantee of the source
          of water entry, and it is not a contractual offer — the final price
          is provided by our team after an on-site assessment.
        </p>
        <ul>
          <li>
            <strong>Final pricing is confirmed on site.</strong> The final
            contract price is subject to verification of measurements,
            excavation depth, equipment access, soil and foundation conditions,
            utilities, drainage connections, disposal and restoration
            requirements.
          </li>
          <li>
            <strong>Hidden conditions:</strong> conditions that cannot be seen
            in photographs (buried concrete, rock, utilities, soil problems,
            foundation deterioration) may change the price through a revised
            quotation or written change order.
          </li>
          <li>
            <strong>Validity:</strong> estimates are valid for 30 days unless
            stated otherwise.
          </li>
        </ul>

        <h2>Accepting an estimate &amp; deposits</h2>
        <p>
          You may choose to <strong>accept</strong> your instant estimate to
          reserve your project in our schedule ahead of other requests.
          Accepting is not a binding contract or a guarantee of the final
          price — it confirms your interest and priority. A{" "}
          <strong>refundable deposit</strong> (currently 20% of the estimated
          range) is required to confirm and hold your priority slot. We do{" "}
          <strong>not</strong> collect, process, or store payment card details
          through this website. When you accept an estimate, our team will
          contact you by phone to arrange the deposit using our standard,
          secure point-of-sale terminal. Deposit refund terms will be
          confirmed with you directly at the time of collection.
        </p>

        <h2>Municipal rebates</h2>
        <p>
          Where we show an estimated rebate (for example municipal
          flood-protection subsidy programs), the figure applies only to
          eligible items, is an <strong>estimate only</strong>, and is subject
          to your municipality&apos;s program rules, application process and
          approval. We do not guarantee that any rebate will be granted, and
          program amounts change without notice.
        </p>

        <h2>Your photo submissions</h2>
        <p>By uploading photos you confirm that:</p>
        <ul>
          <li>the photos are current and show the property in question;</li>
          <li>you own the property or are authorized to request work on it;</li>
          <li>
            you have disclosed known obstacles, previous waterproofing work and
            known leaks to the best of your knowledge.
          </li>
        </ul>
        <p>
          How we store and protect photos is covered in our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2>Service area</h2>
        <p>
          We serve {site.serviceArea} Submissions from outside this area may be
          declined.
        </p>

        <h2>Website content</h2>
        <p>
          Content on this site is provided for general information about our
          services and is not professional engineering advice. Published rates
          are starting points; your written quote governs.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, {site.name} is not liable for
          losses arising from reliance on a preliminary online estimate before a
          written contract is in place. Nothing in these terms limits rights you
          have under applicable consumer-protection law.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms; the date above reflects the latest
          version. Continued use of the site means you accept the updated
          terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? <a href={site.emailHref}>{site.email}</a> · {site.phone} ·{" "}
          {site.address}
        </p>
      </div>
    </section>
  );
}
