import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/lib/site";
import type { ServicePageContent } from "@/lib/services/pages";
import {
  CRACK_REPAIR_VIDEO_ID,
  CRACK_REPAIR_VIDEO_POSTER,
  CRACK_REPAIR_VIDEO_SRC,
  CRACK_REPAIR_VIDEO_TITLE,
  hasCrackRepairVideo,
} from "@/lib/crackRepair";
import { CtaBand } from "@/components/CtaBand";
import { VideoEmbed } from "@/components/VideoEmbed";
import { CheckIcon, PhoneIcon } from "@/components/Icons";

export function serviceMetadata(page: ServicePageContent): Metadata {
  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: { canonical: `/services/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${site.url}/services/${page.slug}`,
      images: [{ url: page.heroImage.startsWith("/") ? `${site.url}${page.heroImage}` : page.heroImage }],
    },
  };
}

export function ServicePageView({ page }: { page: ServicePageContent }) {
  const service = services.find((s) => s.slug === page.slug);
  if (!service) return null;
  const others = services.filter((s) => s.slug !== page.slug);
  const leadPhoto = page.gallery[0];

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: page.metaDescription,
    url: `${site.url}/services/${page.slug}`,
    provider: { "@type": "HomeAndConstructionBusiness", name: site.name, url: site.url, telephone: site.phone },
    areaServed: { "@type": "AdministrativeArea", name: "Southern Ontario" },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${site.url}/services/${page.slug}` },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="page-hero">
        <div className="page-hero__bg">
          <Image
            src={page.heroImage}
            alt={page.heroAlt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="page-hero__overlay" />
        <div className="container page-hero__inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/services">Services</Link> / {service.title}
          </div>
          <span className="eyebrow">Our Services</span>
          <h1>{service.title}</h1>
          <p>{page.heroLead}</p>
        </div>
      </section>

      {/* Intro + features */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div>
              <span className="eyebrow">What it is</span>
              <h2 className="section-title" style={{ fontSize: "1.9rem" }}>
                {service.short}
              </h2>
              {page.intro.map((p) => (
                <p key={p.slice(0, 40)} className="section-lead" style={{ marginBottom: 18 }}>
                  {p}
                </p>
              ))}
              <ul className="feature-list" style={{ margin: "26px 0 30px" }}>
                {service.features.map((f) => (
                  <li key={f}>
                    <CheckIcon /> {f}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link href="/estimate" className="btn btn--primary">
                  Get an Instant Estimate
                </Link>
                <a href={site.phoneHref} className="btn btn--ghost">
                  <PhoneIcon size={18} /> {site.phone}
                </a>
              </div>
            </div>
            {leadPhoto ? (
              <figure className="split__media service-figure">
                <Image
                  src={leadPhoto.src}
                  alt={leadPhoto.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 600px"
                  style={{ objectFit: "cover" }}
                />
                <figcaption>{leadPhoto.caption}</figcaption>
              </figure>
            ) : (
              <div className="split__media">
                <Image
                  src={service.image}
                  alt={`${service.title} work`}
                  fill
                  sizes="(max-width: 900px) 100vw, 600px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section section--alt">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">How We Do It</span>
            <h2 className="section-title">{page.processTitle}</h2>
          </div>
          <ol className="process">
            {page.steps.map((step, i) => (
              <li key={step.title} className="process-step">
                <div className="process-step__num" aria-hidden="true">
                  {i + 1}
                </div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Video (crack repair) or photo gallery */}
      {page.showCrackRepairVideo && hasCrackRepairVideo ? (
        <section className="section">
          <div className="container">
            <div className="center" style={{ marginBottom: 32 }}>
              <span className="eyebrow">Watch</span>
              <h2 className="section-title">See the repair, start to finish</h2>
              <p className="section-lead">
                A 90-second walkthrough of the interior crack repair — the same
                seven steps our crew follows on every job.
              </p>
            </div>
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
              <VideoEmbed
                src={CRACK_REPAIR_VIDEO_SRC}
                poster={CRACK_REPAIR_VIDEO_POSTER}
                youtubeId={CRACK_REPAIR_VIDEO_ID}
                title={CRACK_REPAIR_VIDEO_TITLE}
              />
              <p className="form__note" style={{ textAlign: "center", marginTop: 16 }}>
                Shareable page: <Link href="/crack-repair-process">dryfortwaterproofing.ca/crack-repair-process</Link>
              </p>
            </div>
          </div>
        </section>
      ) : page.gallery.length > 0 ? (
        <section className="section">
          <div className="container">
            <div className="center" style={{ marginBottom: 32 }}>
              <span className="eyebrow">On the Job</span>
              <h2 className="section-title">What the work looks like</h2>
            </div>
            <div className="photo-grid">
              {page.gallery.map((photo) => (
                <figure key={photo.src} className="photo-grid__item">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Pricing + FAQ */}
      <section className="section section--alt">
        <div className="container">
          {page.pricing && (
            <div className="center" style={{ marginBottom: 48 }}>
              <span className="eyebrow">Pricing</span>
              <div className="price-banner">
                <span className="price-banner__figure">{page.pricing.figure}</span>
                <span className="price-banner__unit">{page.pricing.unit}</span>
              </div>
              <p className="section-lead" style={{ margin: "0 auto 20px" }}>
                {page.pricing.note}
              </p>
              <Link href="/pricing" className="btn btn--ghost">
                See Full Pricing
              </Link>
            </div>
          )}
          <div className="center" style={{ marginBottom: 32 }}>
            <span className="eyebrow">Common Questions</span>
            <h2 className="section-title">{service.title} FAQs</h2>
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

      {/* Other services */}
      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 36 }}>
            <span className="eyebrow">Other Services</span>
            <h2 className="section-title">Everything else we do</h2>
          </div>
          <div className="grid grid--3">
            {others.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="card card--link">
                <h3>{s.title}</h3>
                <p>{s.short}</p>
                <span className="card__link">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading={`Need ${service.title.toLowerCase()}?`}
        text="Get a free, written, itemized quote — or call the 24/7 line if water is coming in right now."
      />
    </>
  );
}
