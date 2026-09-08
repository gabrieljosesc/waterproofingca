import Link from "next/link";
import { site } from "@/lib/site";
import { PhoneIcon } from "@/components/Icons";

type CtaBandProps = {
  heading?: string;
  text?: string;
};

export function CtaBand({
  heading = "Wet basement? Leaky foundation? We can fix it.",
  text = "Get a free, no-obligation quote — or call our 24/7 emergency line right now if water is coming in. A real person answers, day or night.",
}: CtaBandProps) {
  return (
    <section className="section section--tight">
      <div className="container">
        <div className="cta-band">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            Free Estimates · 24/7 Emergency
          </span>
          <h2>{heading}</h2>
          <p>{text}</p>
          <div className="cta-band__actions">
            <Link href="/contact" className="btn btn--primary">
              Request a Free Quote
            </Link>
            <a href={site.phoneHref} className="btn btn--ghost">
              <PhoneIcon size={18} /> {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
