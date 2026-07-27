import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { images, services } from "@/lib/site";
import { CtaBand } from "@/components/CtaBand";
import { CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Waterproofing Services",
  description:
    "Exterior & interior basement waterproofing, 24/7 emergency flood response, sump pumps, foundation crack repair and drainage systems across Southern Ontario.",
};

const process = [
  {
    step: "01",
    title: "Free Assessment",
    text: "We inspect your foundation, find where the water is getting in, and explain exactly what's happening — in plain language.",
  },
  {
    step: "02",
    title: "Written Quote",
    text: "You get a free, itemized quote — from $275 per linear foot for exterior work, $120 for interior, with residential and commercial pricing spelled out.",
  },
  {
    step: "03",
    title: "The Fix",
    text: "Our crew installs the full system — excavation, membrane, drainage, pumps — cleanly and on schedule.",
  },
  {
    step: "04",
    title: "Dry, Guaranteed",
    text: "We back the work with a transferable 25-year warranty and stay reachable 24/7 if anything ever comes up.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__bg">
          <Image
            src={images.foundationWork}
            alt="Technician working on a concrete foundation wall"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="page-hero__overlay" />
        <div className="container page-hero__inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Services
          </div>
          <span className="eyebrow">Our Services</span>
          <h1>Waterproofing, Start to Finish</h1>
          <p>
            Six core services covering every way water gets into a building —
            handled by one experienced crew, available 24/7 across Southern
            Ontario.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {services.map((service, i) => (
            <div
              key={service.slug}
              id={service.slug}
              className={
                i % 2 === 1 ? "service-row service-row--reverse" : "service-row"
              }
            >
              <div className="service-row__media">
                <Image
                  src={service.image}
                  alt={`${service.title} work`}
                  fill
                  sizes="(max-width: 900px) 100vw, 600px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div>
                <span className="eyebrow">
                  {String(i + 1).padStart(2, "0")} — Service
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="feature-list">
                  {service.features.map((f) => (
                    <li key={f}>
                      <CheckIcon /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="btn btn--primary"
                  style={{ marginTop: 26 }}
                >
                  Request a Free Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="section section--alt">
        <div className="container">
          <div className="center" style={{ marginBottom: 48 }}>
            <span className="eyebrow">How It Works</span>
            <h2 className="section-title">Our Process</h2>
            <p className="section-lead">
              From first call to a permanently dry basement — no guesswork, no
              surprises.
            </p>
          </div>
          <div className="grid grid--4">
            {process.map((p) => (
              <div key={p.step} className="card">
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "var(--accent)",
                    marginBottom: 10,
                  }}
                >
                  {p.step}
                </div>
                <h3 style={{ fontSize: "1.15rem" }}>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Not sure which service you need?"
        text="Tell us what you're seeing — damp walls, a crack, standing water — and we'll assess it for free and recommend the right fix."
      />
    </>
  );
}
