import Image from "next/image";
import Link from "next/link";
import { faqs, images, services, site, testimonials } from "@/lib/site";
import { CtaBand } from "@/components/CtaBand";
import {
  AlertIcon,
  CheckIcon,
  ClipboardIcon,
  CrackIcon,
  DollarIcon,
  DrainIcon,
  DropIcon,
  PhoneIcon,
  PumpIcon,
  ShieldDropIcon,
  ShieldIcon,
} from "@/components/Icons";

const serviceIcons: Record<string, React.ReactNode> = {
  "exterior-waterproofing": <ShieldDropIcon />,
  "interior-waterproofing": <DropIcon />,
  "emergency-flood-response": <AlertIcon />,
  "sump-pump-installation": <PumpIcon />,
  "foundation-crack-repair": <CrackIcon />,
  "drainage-systems": <DrainIcon />,
};

const whyUs = [
  {
    icon: <AlertIcon />,
    title: "True 24/7 Emergency Response",
    text: "Basements don't flood on a schedule. Our emergency line is answered by a real person around the clock, and crews dispatch across Southern Ontario — nights, weekends and holidays.",
  },
  {
    icon: <DollarIcon />,
    title: "Transparent Pricing",
    text: "Clear pricing from $275 per linear foot for exterior waterproofing, with free written, itemized quotes for every residential and commercial job. No surprises, no upselling.",
  },
  {
    icon: <ShieldIcon />,
    title: "Warrantied, Insured Work",
    text: "Transferable 25-year warranty on exterior systems, lifetime warranty on crack injections, and fully licensed, insured crews on every site.",
  },
  {
    icon: <ClipboardIcon />,
    title: "Honest Assessments",
    text: "We recommend the fix your property actually needs — not the biggest ticket. Every assessment is free and comes with straight answers.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <Image
            src={images.heroWork}
            alt="Waterproofing crew working along a building foundation"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="hero__overlay" />
        <div className="container hero__inner">
          <span className="hero__badge">
            <AlertIcon size={16} /> 24/7 Emergency Crews On Call
          </span>
          <h1>
            Basement Waterproofing That <span>Keeps Ontario Dry</span>
          </h1>
          <p className="hero__lead">
            {site.name}{" "}protects homes and commercial buildings across Southern
            Ontario with exterior &amp; interior waterproofing, sump pumps,
            crack repair — and true 24/7 emergency flood response when water
            won&apos;t wait.
          </p>
          <div className="hero__actions">
            <Link href="/contact" className="btn btn--primary">
              Get a Free Quote
            </Link>
            <a href={site.phoneHref} className="btn btn--ghost">
              <PhoneIcon size={18} /> Emergency: {site.phone}
            </a>
          </div>
          <div className="hero__stats">
            <div className="stat">
              <div className="stat__value">24/7</div>
              <div className="stat__label">Emergency Response</div>
            </div>
            <div className="stat">
              <div className="stat__value">$275+</div>
              <div className="stat__label">Per Linear Foot</div>
            </div>
            <div className="stat">
              <div className="stat__value">25-Yr</div>
              <div className="stat__label">Transferable Warranty</div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee strip */}
      <section className="section--tight" style={{ paddingTop: 40, paddingBottom: 0 }}>
        <div className="container">
          <div className="guarantees">
            <div className="guarantee">
              <div className="guarantee__icon">
                <ShieldIcon size={22} />
              </div>
              <div>
                <strong>25-Year Warranty</strong>
                <span>Transferable, in writing</span>
              </div>
            </div>
            <div className="guarantee">
              <div className="guarantee__icon">
                <DollarIcon size={22} />
              </div>
              <div>
                <strong>Price Match Guarantee</strong>
                <span>Beat any written quote</span>
              </div>
            </div>
            <div className="guarantee">
              <div className="guarantee__icon">
                <ClipboardIcon size={22} />
              </div>
              <div>
                <strong>Licensed &amp; Insured</strong>
                <span>WSIB-covered crews</span>
              </div>
            </div>
            <div className="guarantee">
              <div className="guarantee__icon">
                <AlertIcon size={22} />
              </div>
              <div>
                <strong>24/7 Live Answer</strong>
                <span>Real person, every call</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="section section--alt">
        <div className="container">
          <div className="center" style={{ marginBottom: 48 }}>
            <span className="eyebrow">What We Do</span>
            <h2 className="section-title">Complete Waterproofing Services</h2>
            <p className="section-lead">
              From a hairline foundation crack to a flooded commercial basement
              — one call covers it all, anywhere in Southern Ontario.
            </p>
          </div>
          <div className="grid grid--3">
            {services.map((service) => (
              <div key={service.slug} className="card">
                <div className="card__icon">{serviceIcons[service.slug]}</div>
                <h3>{service.title}</h3>
                <p>{service.short}</p>
                <Link href={`/services#${service.slug}`} className="card__link">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing strip */}
      <section className="section section--tight">
        <div className="container center">
          <span className="eyebrow">Straightforward Pricing</span>
          <h2 className="section-title">Know the number before we dig</h2>
          <div className="price-banner">
            <span className="price-banner__figure">From $275</span>
            <span className="price-banner__unit">
              per linear foot · exterior waterproofing
            </span>
          </div>
          <p
            className="section-lead"
            style={{ margin: "0 auto 20px" }}
          >
            Transparent pricing for full exterior foundation waterproofing —
            excavation, membrane, drainage board and new weeping tile included.
            The final rate depends on depth, access and site conditions, and
            every residential and commercial quote is free, written and
            itemized.
          </p>
          <p
            className="eyebrow"
            style={{ justifyContent: "center", marginBottom: 28 }}
          >
            Financing available · pay monthly
          </p>
          <Link href="/pricing" className="btn btn--primary">
            See Full Pricing
          </Link>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section section--alt">
        <div className="container">
          <div className="split">
            <div className="split__media">
              <Image
                src={images.foundationWork}
                alt="Technician building up a concrete foundation wall"
                fill
                sizes="(max-width: 900px) 100vw, 600px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <span className="eyebrow">Why DryFort</span>
              <h2 className="section-title">
                The crew Southern Ontario calls when water gets in
              </h2>
              <p className="section-lead" style={{ marginBottom: 28 }}>
                Waterproofing done wrong gets redone in five years.
                Waterproofing done right disappears — your basement just stays
                dry. That&apos;s the job.
              </p>
              <div className="grid" style={{ gap: 18 }}>
                {whyUs.map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: 16 }}>
                    <div className="card__icon" style={{ marginBottom: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", marginBottom: 4 }}>
                        {item.title}
                      </h3>
                      <p style={{ color: "var(--text-muted)" }}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work gallery */}
      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Our Work</span>
            <h2 className="section-title">Protection From the Ground Up</h2>
            <p className="section-lead">
              Excavation, membranes, drainage and pumps — the full system,
              installed properly.
            </p>
          </div>
          <div className="gallery">
            <div className="gallery__item gallery__item--wide">
              <Image
                src={images.excavator}
                alt="Excavation equipment preparing a foundation dig"
                width={800}
                height={500}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="gallery__item">
              <Image
                src={images.foundationBlocks}
                alt="Concrete foundation blocks on excavated soil"
                width={500}
                height={500}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="gallery__item">
              <Image
                src={images.pipeTrench}
                alt="Weeping tile drainage pipe laid in a trench"
                width={500}
                height={500}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="gallery__item">
              <Image
                src={images.crackWall}
                alt="Vertical crack running through a concrete wall"
                width={500}
                height={500}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="gallery__item gallery__item--wide">
              <Image
                src={images.houseClassic}
                alt="Protected Southern Ontario home"
                width={800}
                height={500}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section--alt">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Reviews</span>
            <h2 className="section-title">What Homeowners Say</h2>
            <p className="section-lead">
              Dry basements across Southern Ontario — in their words.
            </p>
          </div>
          <div className="grid grid--3">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial">
                <div className="testimonial__stars" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
                <p>&ldquo;{t.text}&rdquo;</p>
                <footer>
                  <div className="testimonial__name">{t.name}</div>
                  <div className="testimonial__meta">
                    {t.location} · {t.service}
                  </div>
                </footer>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">Common Questions</span>
            <h2 className="section-title">Waterproofing FAQs</h2>
            <p className="section-lead">
              Straight answers about cost, coverage and what actually fixes a
              wet basement.
            </p>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Service area strip */}
      <section className="section section--tight section--alt">
        <div className="container center">
          <span className="eyebrow">Where We Work</span>
          <h2 className="section-title">Serving All of Southern Ontario</h2>
          <p className="section-lead">{site.serviceArea}</p>
          <ul
            className="feature-list"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              maxWidth: 820,
              margin: "26px auto 0",
              textAlign: "left",
            }}
          >
            {site.serviceCities.map((city) => (
              <li key={city}>
                <CheckIcon /> {city}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
