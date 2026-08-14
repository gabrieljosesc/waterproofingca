import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CityPage } from "@/lib/cities";
import { images, services, site } from "@/lib/site";
import { CtaBand } from "@/components/CtaBand";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "@/components/Icons";

export function cityMetadata(page: CityPage): Metadata {
  return {
    // `absolute` bypasses the root layout's "%s | DryFort Waterproofing"
    // template — these titles already end in "| DryFort".
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: { canonical: `/basement-waterproofing-${page.slug}` },
  };
}

function CityStructuredData({ page }: { page: CityPage }) {
  const url = `${site.url}/basement-waterproofing-${page.slug}`;

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Basement Waterproofing",
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: site.name,
      telephone: site.phone,
      url: site.url,
    },
    areaServed: { "@type": "City", name: `${page.name}, Ontario` },
    url,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: `Basement Waterproofing ${page.name}`,
        item: url,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}

export function CityPageView({ page }: { page: CityPage }) {
  const serviceBySlug = new Map(services.map((s) => [s.slug, s]));

  return (
    <>
      <CityStructuredData page={page} />

      <section className="page-hero">
        <div className="page-hero__bg">
          <Image
            src={images.foundationWork}
            alt={`Foundation waterproofing work, ${page.name}`}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="page-hero__overlay" />
        <div className="container page-hero__inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Basement Waterproofing {page.name}
          </div>
          <span className="eyebrow">Serving {page.name}</span>
          <h1>Basement Waterproofing in {page.name}</h1>
          <p>{page.heroSubhead}</p>
          <div className="cta-band__actions" style={{ justifyContent: "flex-start", marginTop: 20 }}>
            <Link href="/estimate" className="btn btn--primary">
              Get Your Instant Quote
            </Link>
            <a href={site.phoneHref} className="btn btn--ghost">
              <PhoneIcon size={18} /> Emergency: {site.phone}
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
      </section>

      {/* Local problem */}
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <span className="eyebrow">Why {page.name} Basements Leak</span>
          <h2 className="section-title" style={{ marginBottom: 20 }}>
            The Local Picture
          </h2>
          {page.localProblem.map((para, i) => (
            <p key={i} className="section-lead" style={{ textAlign: "left", margin: "0 0 16px" }}>
              {para}
            </p>
          ))}
          {page.subsidy && (
            <div className="card" style={{ marginTop: 8 }}>
              <h3 style={{ marginBottom: 10 }}>{page.subsidy.programName}</h3>
              <p style={{ margin: "0 0 12px" }}>{page.subsidy.summary}</p>
              <a href={page.subsidy.officialUrl} target="_blank" rel="noopener noreferrer">
                See the official program page →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Services in this city */}
      <section className="section section--alt">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">What We Do</span>
            <h2 className="section-title">Services in {page.name}</h2>
          </div>
          <div className="grid grid--3">
            {page.serviceLines.map((sl) => {
              const service = serviceBySlug.get(sl.slug);
              if (!service) return null;
              return (
                <Link
                  key={sl.slug}
                  href={`/services#${sl.slug}`}
                  className="card"
                  style={{ display: "block", textDecoration: "none", color: "inherit" }}
                >
                  <h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>{service.title}</h3>
                  <p style={{ margin: 0 }}>{sl.line}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section">
        <div className="container center">
          <span className="eyebrow">Transparent Pricing</span>
          <h2 className="section-title">{page.name} Rates</h2>
          <div className="price-banner">
            <span className="price-banner__figure">From ${site.pricing.exteriorFrom}</span>
            <span className="price-banner__unit">
              per linear foot exterior · ${site.pricing.exteriorMinJob.toLocaleString()} minimum job
            </span>
          </div>
          <p className="section-lead" style={{ margin: "10px auto 0" }}>
            Interior systems start at ${site.pricing.interiorPerFoot}/ft (${site.pricing.interiorMinJob.toLocaleString()} minimum).
            Final price is confirmed at a free on-site visit — or get an instant estimated range online first.
          </p>
        </div>
      </section>

      {/* Neighbourhoods */}
      <section className="section section--tight section--alt">
        <div className="container center">
          <span className="eyebrow">Neighbourhoods We Cover</span>
          <h2 className="section-title">All of {page.name}</h2>
          <ul
            className="feature-list"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              maxWidth: 700,
              margin: "26px auto 0",
              textAlign: "left",
            }}
          >
            {page.neighbourhoods.map((n) => (
              <li key={n}>
                <CheckIcon /> {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">{page.name} Questions</span>
            <h2 className="section-title">Basement Waterproofing FAQs — {page.name}</h2>
          </div>
          <div className="faq">
            {page.faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading={`Wet basement in ${page.name}? We can fix it.`}
        text="Get a free, no-obligation quote — or call our 24/7 emergency line right now if water is coming in."
      />
    </>
  );
}
