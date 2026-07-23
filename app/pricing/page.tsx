import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { images, site } from "@/lib/site";
import { CtaBand } from "@/components/CtaBand";
import { CostCalculator } from "@/components/CostCalculator";
import { CardIcon, CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Pricing & Costs",
  description:
    "Transparent basement waterproofing pricing in Southern Ontario: $250 to $350 per linear foot for exterior foundation waterproofing, $175 for interior. Free itemized quotes for residential and commercial properties.",
};

const included = [
  "Full excavation down to the footing",
  "Foundation cleaning & crack repair",
  "Rubberized waterproof membrane",
  "Dimpled drainage board",
  "New weeping tile & clear gravel",
  "Backfill, grading & site clean-up",
  "Transferable 25-year warranty",
];

export default function PricingPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__bg">
          <Image
            src={images.houseModern}
            alt="Modern protected home at dusk"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="page-hero__overlay" />
        <div className="container page-hero__inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Pricing
          </div>
          <span className="eyebrow">Transparent Pricing</span>
          <h1>One Honest Rate. No Surprises.</h1>
          <p>
            Waterproofing quotes shouldn&apos;t be a mystery. Ours start with a
            number you can plan around — published right here.
          </p>
        </div>
      </section>

      {/* Headline rate */}
      <section className="section">
        <div className="container center">
          <span className="eyebrow">Exterior Waterproofing</span>
          <h2 className="section-title">The DryFort Rate</h2>
          <div className="price-banner">
            <span className="price-banner__figure">$250–350</span>
            <span className="price-banner__unit">per linear foot</span>
          </div>
          <p className="section-lead" style={{ margin: "0 auto" }}>
            That&apos;s the complete exterior system, not a teaser rate. Where
            you land in the range depends on access and site conditions, like
            excavation depth, what&apos;s on the ground, and how easily
            equipment can reach the wall. We confirm the exact figure at your
            free on-site assessment.
          </p>
          <div
            className="card"
            style={{ maxWidth: 560, margin: "36px auto 0", textAlign: "left" }}
          >
            <h3 style={{ marginBottom: 16 }}>Every linear foot includes:</h3>
            <ul className="feature-list">
              {included.map((item) => (
                <li key={item}>
                  <CheckIcon /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="card"
            style={{ maxWidth: 560, margin: "20px auto 0", textAlign: "left" }}
          >
            <h3 style={{ marginBottom: 6 }}>Interior waterproofing</h3>
            <div className="price-card__tag" style={{ marginBottom: 12 }}>
              $175 per linear foot
            </div>
            <p style={{ color: "var(--text-muted)" }}>
              Internal drainage systems for when exterior access isn&apos;t
              practical. Sump pump, backup battery and other add-ons are quoted
              separately.
            </p>
          </div>
        </div>
      </section>

      {/* Instant estimate calculator */}
      <section className="section section--tight">
        <div className="container">
          <div className="center" style={{ marginBottom: 36 }}>
            <span className="eyebrow">Try It Yourself</span>
            <h2 className="section-title">Estimate Your Project in Seconds</h2>
          </div>
          <CostCalculator />
        </div>
      </section>

      {/* Residential vs Commercial */}
      <section className="section section--alt">
        <div className="container">
          <div className="center" style={{ marginBottom: 48 }}>
            <span className="eyebrow">Who We Serve</span>
            <h2 className="section-title">Residential &amp; Commercial</h2>
            <p className="section-lead">
              Same crew, same standards — pricing structured for the property.
            </p>
          </div>
          <div className="grid grid--2">
            <div className="price-card">
              <div className="price-card__media">
                <Image
                  src={images.houseClassic}
                  alt="Southern Ontario family home"
                  fill
                  sizes="(max-width: 900px) 100vw, 600px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="price-card__body">
                <h3>Residential</h3>
                <div className="price-card__tag">
                  From $250 / linear foot · free itemized quote
                </div>
                <p>
                  Houses, semis, townhomes and cottages. We protect the place
                  your family lives — with scheduling that respects it.
                </p>
                <ul className="feature-list">
                  <li>
                    <CheckIcon /> Free on-site assessment &amp; written quote
                  </li>
                  <li>
                    <CheckIcon /> Exterior &amp; interior system options
                  </li>
                  <li>
                    <CheckIcon /> Sump pump &amp; backwater valve subsidies
                    guidance
                  </li>
                  <li>
                    <CheckIcon /> Transferable 25-year warranty
                  </li>
                </ul>
                <Link href="/contact" className="btn btn--primary">
                  Get a Residential Quote
                </Link>
              </div>
            </div>

            <div className="price-card">
              <div className="price-card__media">
                <Image
                  src={images.commercial}
                  alt="Commercial building exterior"
                  fill
                  sizes="(max-width: 900px) 100vw, 600px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="price-card__body">
                <h3>Commercial</h3>
                <div className="price-card__tag">
                  Volume pricing on larger runs · project quotes
                </div>
                <p>
                  Commercial and industrial foundations, parking garages,
                  multi-unit residential. Scoped and scheduled around your
                  operations.
                </p>
                <ul className="feature-list">
                  <li>
                    <CheckIcon /> Detailed scope &amp; project quote
                  </li>
                  <li>
                    <CheckIcon /> Volume rates on long foundation runs
                  </li>
                  <li>
                    <CheckIcon /> After-hours &amp; phased scheduling
                  </li>
                  <li>
                    <CheckIcon /> Full WSIB coverage &amp; liability insurance
                  </li>
                </ul>
                <Link href="/contact" className="btn btn--primary">
                  Get a Commercial Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financing */}
      <section className="section">
        <div className="container">
          <div className="finance">
            <div className="finance__content">
              <span className="eyebrow">
                <CardIcon size={16} /> Financing Available
              </span>
              <h2 className="section-title">
                Waterproof now, pay monthly
              </h2>
              <p className="section-lead" style={{ marginBottom: 24 }}>
                A wet basement gets worse and more expensive the longer it
                waits. With flexible financing, you can protect your home right
                away and spread the cost over affordable monthly payments —
                instead of putting it off until the next flood.
              </p>
              <ul className="feature-list">
                <li>
                  <CheckIcon /> $0-down payment plans available
                </li>
                <li>
                  <CheckIcon /> Low, predictable monthly payments
                </li>
                <li>
                  <CheckIcon /> Terms up to 10 years (on approved credit)
                </li>
                <li>
                  <CheckIcon /> Quick application when you book your free
                  assessment
                </li>
                <li>
                  <CheckIcon /> Residential &amp; commercial projects
                </li>
              </ul>
              <Link
                href="/contact"
                className="btn btn--primary"
                style={{ marginTop: 26 }}
              >
                Ask About Financing
              </Link>
            </div>

            <aside className="finance__card">
              <div className="finance__card-label">Example plan</div>
              <div className="finance__card-figure">
                ~$100<span>/mo</span>
              </div>
              <p className="finance__card-note">
                A typical $12,000 exterior waterproofing project (about 40
                linear feet) financed over 10 years.
              </p>
              <div className="finance__card-divider" />
              <p className="finance__card-fine">
                Illustrative example only, before HST, on approved credit.
                Actual monthly payment depends on project size, term and rate.
                We&apos;ll walk you through the exact numbers at your free
                assessment.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Price match */}
      <section className="section section--tight section--alt">
        <div className="container center">
          <span className="eyebrow">Fair Pricing</span>
          <h2 className="section-title">Price match guarantee</h2>
          <p className="section-lead" style={{ margin: "0 auto" }}>
            Receive a lower written quote for the same scope of work? Bring it
            to us and we&apos;ll match it. Honest pricing shouldn&apos;t require
            haggling.
          </p>
        </div>
      </section>

      {/* Other services note */}
      <section className="section section--tight">
        <div className="container center">
          <span className="eyebrow">Other Services</span>
          <h2 className="section-title">Crack repairs, sump pumps &amp; more</h2>
          <p className="section-lead" style={{ margin: "0 auto 28px" }}>
            Interior systems, crack injections, sump pump installs and drainage
            work are quoted per project — always free, always written, always
            itemized. Emergency call-outs are quoted up front before any work
            begins.
          </p>
          <div className="cta-band__actions">
            <Link href="/services" className="btn btn--ghost">
              Browse All Services
            </Link>
            <a href={site.phoneHref} className="btn btn--primary">
              Call {site.phone}
            </a>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Want an exact number for your property?"
        text="Send us the details and we'll get you a free, written, itemized quote — usually within one business day."
      />
    </>
  );
}
