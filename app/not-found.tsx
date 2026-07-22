import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
      <div className="container center">
        <span className="eyebrow">404</span>
        <h1 className="section-title">This page has sprung a leak</h1>
        <p className="section-lead" style={{ margin: "0 auto 28px" }}>
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get
          you back to dry land.
        </p>
        <Link href="/" className="btn btn--primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
