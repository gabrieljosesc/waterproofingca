import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { images, site } from "@/lib/site";
import { CtaBand } from "@/components/CtaBand";
import { CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about DryFort Waterproofing — Southern Ontario's 24/7 emergency basement waterproofing company for residential and commercial properties.",
};

const values = [
  {
    title: "Answer the Call",
    text: "Our 24/7 line is answered by a person, not a machine. When your basement is flooding at 3 AM, that matters.",
  },
  {
    title: "Price It Straight",
    text: "From $275 per linear foot for exterior, published on our website. Free, itemized quotes. If a cheaper fix will do the job, we'll tell you.",
  },
  {
    title: "Fix It Once",
    text: "Full systems installed properly — membrane, drainage, pumps — so the water problem is solved, not postponed.",
  },
  {
    title: "Stand Behind It",
    text: "Transferable 25-year warranty on exterior work, lifetime warranty on crack injections. In writing.",
  },
];

const stats = [
  { value: "24/7", label: "Emergency Response" },
  { value: "$275+", label: "Per Linear Foot" },
  { value: "25-Yr", label: "Transferable Warranty" },
  { value: "100%", label: "Licensed & Insured" },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__bg">
          <Image
            src={images.houseModern}
            alt="Protected modern home at dusk"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="page-hero__overlay" />
        <div className="container page-hero__inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / About Us
          </div>
          <span className="eyebrow">About Us</span>
          <h1>Built to Keep Water Out</h1>
          <p>
            {site.name}{" "}is a Southern Ontario waterproofing company with one
            job: keeping basements dry — residential and commercial, rain or
            shine, day or night.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div className="split__media">
              <Image
                src={images.heroWork}
                alt="DryFort crew waterproofing a building foundation"
                fill
                sizes="(max-width: 900px) 100vw, 600px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <span className="eyebrow">Who We Are</span>
              <h2 className="section-title">
                Waterproofing specialists, not generalists
              </h2>
              <p className="section-lead" style={{ marginBottom: 18 }}>
                {site.name}{" "}was built around a frustration every homeowner with
                a wet basement knows: vague quotes, patch jobs, and contractors
                who disappear when it rains. We do one thing — waterproofing —
                and we structured the whole company around doing it right.
              </p>
              <p className="section-lead" style={{ marginBottom: 18 }}>
                That means published pricing, free itemized quotes, full-system
                installations instead of band-aids, and an emergency line that
                actually answers at 3 AM. From single-family homes to
                commercial foundations, Southern Ontario property owners call
                us because water problems don&apos;t fix themselves.
              </p>
              <ul className="feature-list">
                <li>
                  <CheckIcon /> Locally owned and operated
                </li>
                <li>
                  <CheckIcon /> Fully licensed &amp; insured crews
                </li>
                <li>
                  <CheckIcon /> Residential &amp; commercial projects
                </li>
                <li>
                  <CheckIcon /> True 24/7 emergency dispatch
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section--tight section--alt">
        <div className="container">
          <div className="statbar">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="statbar__value">{s.value}</div>
                <div className="statbar__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 48 }}>
            <span className="eyebrow">What We Stand For</span>
            <h2 className="section-title">Our Values</h2>
            <p className="section-lead">
              Four promises we make on every job — emergency or scheduled,
              house or high-rise.
            </p>
          </div>
          <div className="grid grid--4">
            {values.map((v) => (
              <div key={v.title} className="card">
                <div className="card__icon">
                  <CheckIcon size={24} />
                </div>
                <h3 style={{ fontSize: "1.15rem" }}>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="section section--tight section--alt">
        <div className="container center">
          <span className="eyebrow">Service Area</span>
          <h2 className="section-title">Proudly Serving Southern Ontario</h2>
          <p className="section-lead">{site.serviceArea}</p>
        </div>
      </section>

      <CtaBand
        heading="Let's get your basement sorted"
        text="Reach out for a free assessment — or call the 24/7 line if water is coming in right now."
      />
    </>
  );
}
