/**
 * Heuristics that map raw customer intake answers to the structured inputs the
 * pricing engine needs. These are deliberate best-effort guesses — the AI and
 * the owner refine them during review before any price is sent. Kept in one
 * place so they're easy to tune.
 */

import type { HouseAgeBand, LocationTier, RebateCity } from "@/lib/pricing";

export function houseAgeBandFromYear(
  year: number | null | undefined
): HouseAgeBand | null {
  if (!year || !Number.isFinite(year)) return null;
  if (year < 1950) return "pre_1950";
  if (year <= 1980) return "1950_1980";
  return "post_1980";
}

const CITY_TIERS: { tier: LocationTier; cities: string[] }[] = [
  {
    tier: "toronto_suburbs",
    cities: ["scarborough", "etobicoke", "north york", "york", "east york"],
  },
  {
    tier: "belt_905",
    cities: [
      "mississauga",
      "brampton",
      "vaughan",
      "markham",
      "richmond hill",
      "oakville",
      "burlington",
      "milton",
      "pickering",
      "ajax",
    ],
  },
  {
    tier: "outer_gta",
    cities: ["newmarket", "aurora", "barrie", "oshawa", "whitby", "bradford"],
  },
];

/**
 * Best-effort location tier from the city name. Toronto proper defaults to the
 * "suburbs" tier; the owner bumps it to "core" for pre-1960 tight-lot
 * neighbourhoods during review. Unknown cities return null.
 */
export function locationTierFromCity(
  city: string | null | undefined
): LocationTier | null {
  if (!city) return null;
  const c = city.trim().toLowerCase();
  if (c === "toronto") return "toronto_suburbs";
  for (const group of CITY_TIERS) {
    if (group.cities.some((name) => c.includes(name))) return group.tier;
  }
  return null;
}

/** City whose municipal rebate program applies, if any. */
export function rebateCityFromCity(
  city: string | null | undefined
): RebateCity | null {
  if (!city) return null;
  const c = city.trim().toLowerCase();
  if (c.includes("toronto") || c.includes("scarborough") || c.includes("etobicoke") || c.includes("north york"))
    return "toronto";
  if (c.includes("mississauga")) return "mississauga";
  if (c.includes("markham")) return "markham";
  return null;
}

/** Whether the property looks like it's inside the service area. Null = unsure,
 *  owner confirms. */
export function serviceAreaOk(
  city: string | null | undefined
): boolean | null {
  return locationTierFromCity(city) !== null ? true : null;
}
