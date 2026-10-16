import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/lib/site";
import { getServicePage } from "@/lib/services/pages";
import { serviceMetadata, ServicePageView } from "@/components/services/ServicePageView";

type Params = { params: Promise<{ slug: string }> };

/** One static page per service in lib/site.ts; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  return page ? serviceMetadata(page) : {};
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();
  return <ServicePageView page={page} />;
}
