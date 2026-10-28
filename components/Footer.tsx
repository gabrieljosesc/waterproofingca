import Link from "next/link";
import { cityPages } from "@/lib/cities";
import { navLinks, services, site } from "@/lib/site";
import { DropIcon, FacebookIcon } from "@/components/Icons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand-col">
            <Link href="/" className="brand">
              <span className="brand__mark">
                <DropIcon size={22} />
              </span>
              <span className="brand__text">
                <span className="brand__name">{site.name}</span>
                <span className="brand__sub">Southern Ontario · 24/7</span>
              </span>
            </Link>
            <p className="footer__about">
              Southern Ontario&apos;s 24/7 emergency basement waterproofing
              company. Exterior &amp; interior waterproofing, sump pumps, crack
              repair and flood response — residential and commercial.
            </p>
            <a
              href={site.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social"
              aria-label="Follow us on Facebook (opens in a new tab)"
            >
              <FacebookIcon size={20} /> Follow us on Facebook
            </a>
          </div>

          <div className="footer__col">
            <h3>Services</h3>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3>Areas We Serve</h3>
            <ul className="footer__col-list--2up">
              {cityPages.map((c) => (
                <li key={c.slug}>
                  <Link href={`/basement-waterproofing-${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3>Company</h3>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <h3 style={{ marginTop: 28 }}>Get in Touch</h3>
            <ul>
              <li>
                <a href={site.phoneHref}>{site.phone} (24/7)</a>
              </li>
              <li>
                <a href={site.emailHref}>{site.email}</a>
              </li>
              <li>{site.address}</li>
              <li>
                <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span>
            <Link href="/privacy">Privacy Policy</Link>
            {" · "}
            <Link href="/terms">Terms of Service</Link>
          </span>
          <span>
            24/7 Emergency Waterproofing · Serving Southern Ontario
          </span>
        </div>
      </div>
    </footer>
  );
}
