import type { services } from "@/lib/site";

export type CitySubsidy = {
  programName: string;
  maxAmount: number;
  summary: string;
  officialUrl: string;
};

export type CityFaq = { q: string; a: string };

/** One line per homepage service (lib/site.ts `services`), tying it to this city specifically. */
export type CityServiceLine = { slug: (typeof services)[number]["slug"]; line: string };

export type CityPage = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  heroSubhead: string;
  /** 150–300 words, 1–3 paragraphs. What actually makes this city's page unique. */
  localProblem: string[];
  neighbourhoods: string[];
  subsidy?: CitySubsidy;
  serviceLines: CityServiceLine[];
  faqs: CityFaq[];
};
