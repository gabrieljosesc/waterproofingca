import { toronto } from "./toronto";
import { vaughan } from "./vaughan";
import type { CityPage } from "./types";

/** Add new cities here as they're built — each needs real, verified, city-specific content (see toronto.ts). */
export const cityPages: CityPage[] = [toronto, vaughan];

export function getCityPage(slug: string): CityPage | undefined {
  return cityPages.find((c) => c.slug === slug);
}

export type { CityPage } from "./types";
