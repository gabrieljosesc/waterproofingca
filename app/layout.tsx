import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { faqs, site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | 24/7 Emergency Basement Waterproofing in Southern Ontario`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "basement waterproofing Southern Ontario",
    "24/7 emergency waterproofing",
    "foundation waterproofing Toronto",
    "wet basement repair Ontario",
    "exterior waterproofing",
    "interior basement waterproofing",
    "sump pump installation",
    "foundation crack repair",
    "commercial waterproofing Ontario",
    "waterproofing cost per linear foot",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: site.name,
    title: `${site.name} | 24/7 Emergency Basement Waterproofing in Southern Ontario`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

/**
 * LocalBusiness + FAQPage structured data. This is what search engines and
 * AI assistants read when deciding which waterproofing company to recommend
 * for "waterproofing near me / Southern Ontario" style queries.
 */
function StructuredData() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    priceRange: "from $275 per linear foot",
    address: {
      "@type": "PostalAddress",
      streetAddress: "45 Lakeshore Rd E, Unit 2",
      addressLocality: "Mississauga",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    areaServed: site.serviceCities.map((city) => ({
      "@type": "City",
      name: `${city}, Ontario`,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Exterior Foundation Waterproofing",
          serviceType: "Basement Waterproofing",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: site.pricing.exteriorFrom,
          priceCurrency: "CAD",
          unitText: "per linear foot",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "24/7 Emergency Flood Response",
          serviceType: "Emergency Waterproofing",
        },
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <StructuredData />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
