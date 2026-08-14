import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { images, site } from "@/lib/site";
import { EstimateWizard } from "@/components/estimate/EstimateWizard";
import { CheckIcon, WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Get an Instant AI Photo Estimate",
  description:
    "Upload a few photos of your basement or foundation and get an instant AI-powered waterproofing estimate range for your Southern Ontario property — final price confirmed at a free site visit.",
};

const how = [
  "Answer a few quick questions about your property",
  "Add photos of the wall, access and the leak area",
  "Get your instant AI estimate range on the spot",
];

export default function EstimatePage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__bg">
          <Image
            src={images.foundationWork}
            alt="Foundation waterproofing work"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="page-hero__overlay" />
        <div className="container page-hero__inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Photo Estimate
          </div>
          <span className="eyebrow">Photo Estimate</span>
          <h1>Get a Real Estimate From a Few Photos</h1>
          <p>
            Most waterproofing calculators price every job by length alone — two
            walls the same size can cost completely different amounts. Ours
            looks at your actual property: depth, access, what&apos;s on the
            ground, obstructions and more. The more complete your photos, the
            tighter your estimate.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <span className="eyebrow">How it works</span>
              <h2 className="section-title" style={{ fontSize: "1.8rem" }}>
                Three steps to a number
              </h2>
              <ul className="feature-list" style={{ marginBottom: 28 }}>
                {how.map((h) => (
                  <li key={h}>
                    <CheckIcon /> {h}
                  </li>
                ))}
              </ul>
              <p className="section-lead" style={{ marginBottom: 18 }}>
                Your instant estimate is a preliminary range — the final price
                is always confirmed at a free on-site visit with our team. For
                active flooding, calling is faster:
              </p>
              <div className="cta-band__actions" style={{ justifyContent: "flex-start" }}>
                <a href={site.phoneHref} className="btn btn--ghost">
                  {site.phone}
                </a>
                <a
                  href={site.whatsappHref}
                  className="btn btn--ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon size={18} /> WhatsApp
                </a>
              </div>
            </div>

            <EstimateWizard />
          </div>
        </div>
      </section>
    </>
  );
}
