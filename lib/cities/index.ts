import { brantford } from "./brantford";
import { burlington } from "./burlington";
import { guelph } from "./guelph";
import { hamilton } from "./hamilton";
import { kitchener } from "./kitchener";
import { london } from "./london";
import { mississauga } from "./mississauga";
import { niagaraFalls } from "./niagara-falls";
import { oakville } from "./oakville";
import { richmondHill } from "./richmond-hill";
import { stCatharines } from "./st-catharines";
import { toronto } from "./toronto";
import { vaughan } from "./vaughan";
import { waterloo } from "./waterloo";
import type { CityPage } from "./types";

/** Add new cities here as they're built — each needs real, verified, city-specific content (see toronto.ts). */
export const cityPages: CityPage[] = [
  toronto,
  vaughan,
  richmondHill,
  mississauga,
  hamilton,
  burlington,
  oakville,
  stCatharines,
  niagaraFalls,
  kitchener,
  waterloo,
  guelph,
  brantford,
  london,
];

export function getCityPage(slug: string): CityPage | undefined {
  return cityPages.find((c) => c.slug === slug);
}

export type { CityPage } from "./types";
