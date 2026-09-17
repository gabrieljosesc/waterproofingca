import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { images, site } from "@/lib/site";
import {
  CRACK_REPAIR_VIDEO_ID,
  CRACK_REPAIR_VIDEO_TITLE,
  crackRepairSteps,
} from "@/lib/crackRepair";
import { CtaBand } from "@/components/CtaBand";
import { VideoEmbed } from "@/components/VideoEmbed";
import { CheckIcon, PhoneIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "How We Repair a Leaking Foundation Crack — 7-Step Method",
  description:
    "Watch how DryFort repairs a leaking foundation crack from the inside: cut a repair channel, chisel to sound concrete, crystalline waterproofing, then rebuild flush. Serving Southern Ontario 24/7.",
  alternates: { canonical: "/crack-repair-process" },
};

const outcomes = [
  "Repair material bonded to solid, sound concrete — not a weak surface",
  "Waterproofing worked into the concrete inside the channel, not painted over the top",
  "Channel packed and compacted with no voids, finished flush with the wall",
];

export default function CrackRepairProcessPage() {
  const hasVideo = Boolean(CRACK_REPAIR_VIDEO_ID);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__bg">
          <Image
            src={images.crackWall}
            alt="Vertical crack running through a concrete foundation wall"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="page-hero__overlay" />
        <div className="container page-hero__inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/services">Services</Link>{" "}
            / Crack Repair Process
          </div>
          <span className="eyebrow">Foundation Crack Repair</span>
          <h1>{CRACK_REPAIR_VIDEO_TITLE}</h1>
          <p>
            A leaking crack doesn&apos;t get better on its own. Here&apos;s
            exactly how our crew fixes one from the inside — not by covering
            it up, but by rebuilding the wall around it.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {hasVideo && (
            <div style={{ maxWidth: 960, margin: "0 auto 56px" }}>
              <VideoEmbed
                youtubeId={CRACK_REPAIR_VIDEO_ID}
                title={CRACK_REPAIR_VIDEO_TITLE}
              />
            </div>
          )}

          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">The 7 Steps</span>
            <h2 className="section-title">
              {hasVideo ? "What you just watched, step by step" : "Our interior crack repair, step by step"}
            </h2>
            <p className="section-lead">
              Every interior crack repair follows the same sequence. The order
              matters — each step is what makes the next one hold.
            </p>
          </div>

          <ol className="process">
            {crackRepairSteps.map((step, i) => (
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

      <section className="section section--alt">
        <div className="container">
          <div className="split">
            <div>
              <span className="eyebrow">The Result</span>
              <h2 className="section-title">
                A repair zone — not a patch
              </h2>
              <p className="section-lead" style={{ marginBottom: 24 }}>
                When we&apos;re done, the original crack sits inside a properly
                prepared, bonded and waterproofed repair zone. That&apos;s the
                difference between a fix that lasts and one you&apos;ll be
                looking at again next spring.
              </p>
              <ul className="feature-list">
                {outcomes.map((o) => (
                  <li key={o}>
                    <CheckIcon /> {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ alignSelf: "center" }}>
              <h3>Got a crack letting water in?</h3>
              <p style={{ marginBottom: 20 }}>
                Send a few photos for an instant estimate, or call the 24/7
                line and talk to a real person about what you&apos;re seeing.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link href="/estimate" className="btn btn--primary">
                  Get an Instant Estimate
                </Link>
                <a href={site.phoneHref} className="btn btn--ghost">
                  <PhoneIcon size={18} /> {site.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Ready to fix it for good?"
        text="Free written quotes on every crack repair, and 24/7 emergency response across Southern Ontario when water is coming in right now."
      />
    </>
  );
}
