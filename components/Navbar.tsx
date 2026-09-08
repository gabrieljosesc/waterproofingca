"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, site } from "@/lib/site";
import { DropIcon } from "@/components/Icons";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
          <Link href="/" className="brand" onClick={() => setOpen(false)}>
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
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    active ? "nav__link nav__link--active" : "nav__link"
                  }
                  onClick={() => setOpen(false)}
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
