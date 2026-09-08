import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { images, site } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";
import {
  AlertIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact Us — Free Quotes & 24/7 Emergency Line",
  description:
    "Get a free basement waterproofing quote in Southern Ontario, or call DryFort's 24/7 emergency flood line for immediate dispatch.",
};

const details = [
  {
    icon: <AlertIcon />,
    label: "24/7 Emergency Line",
    value: site.phone,
    href: site.phoneHref,
    emergency: true,
  },
  {
    icon: <PhoneIcon />,
    label: "Quotes & General",
    value: site.phone,
    href: site.phoneHref,
  },
  {
    icon: <MailIcon />,
    label: "Email",
    value: site.email,
    href: site.emailHref,
  },
  {
    icon: <MapPinIcon />,
    label: "Address",
    value: site.address,
  },
  {
    icon: <ClockIcon />,
    label: "Hours",
    value: site.hours,
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__bg">
          <Image
            src={images.rainDark}
            alt="Rain drops on a window"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="page-hero__overlay" />
        <div className="container page-hero__inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Contact Us
          </div>
          <span className="eyebrow">Contact Us</span>
          <h1>Get a Free Quote — or Get Help Now</h1>
          <p>
            Planning ahead? Request a free, itemized quote below. Water coming
            in right now? Call the 24/7 emergency line — a crew can be on the
            way tonight.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <span className="eyebrow">Get in Touch</span>
              <h2 className="section-title" style={{ fontSize: "1.8rem" }}>
                We answer — day or night
              </h2>
              <p className="section-lead" style={{ marginBottom: 28 }}>
                Serving all of Southern Ontario, for residential and commercial
                properties. Quotes are free, written and itemized.
              </p>

              {details.map((d) => (
                <div
                  key={d.label}
                  className={
                    d.emergency
                      ? "contact-card contact-card--emergency"
                      : "contact-card"
                  }
                >
                  <div className="contact-card__icon">{d.icon}</div>
                  <div>
                    <div className="contact-card__label">{d.label}</div>
                    <div className="contact-card__value">
                      {d.href ? <a href={d.href}>{d.value}</a> : d.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Service area note */}
      <section className="section section--tight section--alt">
        <div className="container center">
          <span className="eyebrow">Service Area</span>
          <h2 className="section-title">Where We Operate</h2>
          <p className="section-lead">{site.serviceArea}</p>
        </div>
      </section>
    </>
  );
}
