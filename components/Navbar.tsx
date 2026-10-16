"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, services, site } from "@/lib/site";
import { DropIcon } from "@/components/Icons";

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">
          <span className="topbar__pulse">
            <span className="topbar__dot" />
            24/7 Emergency Flood Response
          </span>
          <span className="topbar__hide-mobile">
            Serving all of Southern Ontario
          </span>
          <a href={site.phoneHref} className="topbar__phone">
            {site.phone}
          </a>
        </div>
      </div>

      <header className="header">
        <div className="container header__inner">
          <Link href="/" className="brand" onClick={close}>
            <span className="brand__mark">
              <DropIcon size={22} />
            </span>
            <span className="brand__text">
              <span className="brand__name">{site.name}</span>
              <span className="brand__sub">Southern Ontario · 24/7</span>
            </span>
          </Link>

          <nav className={open ? "nav nav--open" : "nav"}>
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const linkClass = active
                ? "nav__link nav__link--active"
                : "nav__link";

              if (link.href === "/services") {
                return (
                  <div key={link.href} className="nav__item">
                    <Link
                      href={link.href}
                      className={`${linkClass} nav__link--menu`}
                      onClick={close}
                      aria-haspopup="true"
                    >
                      {link.label} <Chevron />
                    </Link>
                    <div className="nav__menu" role="menu">
                      {services.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className={
                            pathname === `/services/${s.slug}`
                              ? "nav__menu-link nav__menu-link--active"
                              : "nav__menu-link"
                          }
                          role="menuitem"
                          onClick={close}
                        >
                          {s.title}
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        className="nav__menu-link nav__menu-link--all"
                        role="menuitem"
                        onClick={close}
                      >
                        All services →
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass}
                  onClick={close}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link href="/estimate" className="btn btn--primary header__cta">
            Get Your Instant Quote
          </Link>

          <button
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </header>
    </>
  );
}
