import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { images, site } from "@/lib/site";
import { EstimateWizard } from "@/components/estimate/EstimateWizard";
import { CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Get an Instant Photo Estimate",
  description:
    "Upload a few photos of your basement or foundation and get a customized waterproofing estimate range for your Southern Ontario property — reviewed by our team before it's sent.",
};

const how = [
  "Answer a few quick questions about your property",
  "Add photos of the wall, access and the leak area",
  "We review everything and send your estimate range",
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
                Every estimate is reviewed by our team before you see it, and
                the final price is always confirmed on site. For active
                flooding, calling is faster:
              </p>
              <a href={site.phoneHref} className="btn btn--ghost">
                {site.phone}
              </a>
            </div>

            <EstimateWizard />
          </div>
        </div>
      </section>
    </>
  );
}
