import type { MetadataRoute } from "next";
import { cityPages } from "@/lib/cities";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/pricing",
    "/about",
    "/contact",
    "/estimate",
    "/privacy",
    "/terms",
    ...cityPages.map((c) => `/basement-waterproofing-${c.slug}`),
  ];
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
