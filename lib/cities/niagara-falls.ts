import type { CityPage } from "./types";

export const niagaraFalls: CityPage = {
  slug: "niagara-falls",
  name: "Niagara Falls",
  metaTitle: "Basement Waterproofing Niagara Falls | 24/7 Emergency Service | DryFort",
  metaDescription:
    "Niagara Falls basement waterproofing from $275 per linear foot. Exterior and interior systems, sump pumps, crack repair. 24/7 emergency flood response. Free written quotes.",
  heroSubhead:
    "DryFort crews serve Chippawa, Stamford, Mount Carmel and every Niagara Falls neighbourhood with exterior and interior waterproofing, crack repair, and true 24/7 flood response.",

  localProblem: [
    "Niagara Falls' waterproofing needs split fairly cleanly by neighbourhood age and location. Chippawa, founded in 1885 and sitting where the Welland and Niagara Rivers meet at the south end of the city, has some of the oldest and most desirable waterfront homes in Niagara Falls — and river-adjacent land means a naturally higher water table pressing on older foundations that were never built with today's hydrostatic pressure in mind.",
    "Stamford and Drummond Heights, in the north end, hold most of the city's mid-century detached housing stock — bungalows and raised bungalows on generous lots, many with basement apartments, where original weeping tile is well past its intended lifespan. Mount Carmel, with its escarpment-adjacent terrain, and Garner in the newer south end deal with more of a drainage-and-grading story on younger builds, closer to what we see in fast-growing suburbs elsewhere in the GTA.",
    "The City runs a Weeping Tile Removal Assistance Program (WRAP) for single-family and semi-detached homes in the urban area connected to the municipal sanitary sewer: 100% of eligible costs to disconnect weeping tile and install a sump pump, up to $4,000, and 100% of eligible costs for a backwater valve, up to $1,200. Multi-residential, townhouse and condo properties aren't eligible.",
  ],

  neighbourhoods: ["Chippawa", "Stamford", "Drummond Heights", "Mount Carmel", "Garner", "North End"],

  subsidy: {
    programName: "Weeping Tile Removal Assistance Program (WRAP)",
    maxAmount: 4000,
    summary:
      "For single-family or semi-detached homes in the urban area connected to the municipal sanitary sewer: 100% of eligible costs to disconnect weeping tile and install a sump pump, up to $4,000, plus 100% of eligible costs for a backwater valve, up to $1,200. Multi-residential, townhouse and condo properties aren't eligible.",
    officialUrl: "https://niagarafalls.ca/property-home-and-environment/water-and-sewer-services/weeping-tile-removal-assistance-program/",
  },

  serviceLines: [
    {
      slug: "exterior-waterproofing",
      line: "From riverfront homes in Chippawa to mid-century bungalows in Stamford, we excavate and seal Niagara Falls foundations for good.",
    },
    {
      slug: "interior-waterproofing",
      line: "On established lots in Stamford and Drummond Heights, an interior system fixes the leak without disturbing mature landscaping.",
    },
    {
      slug: "emergency-flood-response",
      line: "From the Niagara and Welland riverfronts to the north end, our 24/7 line dispatches across Niagara Falls when a basement starts taking on water.",
    },
    {
      slug: "sump-pump-installation",
      line: "River-adjacent Chippawa homes especially need a properly sized sump system — we help you apply for the City's WRAP rebate too.",
    },
    {
      slug: "foundation-crack-repair",
      line: "Older foundations across Stamford and Chippawa see real freeze-thaw and hydrostatic pressure — we inject and seal cracks permanently.",
    },
    {
      slug: "drainage-systems",
      line: "Aging weeping tile is common in Niagara Falls' mid-century bungalows — we replace it and correct grading so water moves away from the house.",
    },
  ],

  faqs: [
    {
      q: "Does Niagara Falls offer a subsidy for basement flooding prevention?",
      a: "Yes. The Weeping Tile Removal Assistance Program (WRAP) covers 100% of eligible costs to disconnect weeping tile and install a sump pump, up to $4,000, plus 100% of backwater valve costs up to $1,200 — for single-family or semi-detached homes in the urban area on municipal sanitary sewer. We identify what your job qualifies for and help you apply.",
    },
    {
      q: "Do I need a permit for exterior waterproofing in Niagara Falls?",
      a: "Backwater valve and weeping tile disconnection work under the WRAP program has its own permit and inspection requirements. Broader exterior excavation work can also require a permit depending on scope. Simple interior crack injection generally doesn't. We confirm exactly what your job needs.",
    },
    {
      q: "How much does basement waterproofing cost in Niagara Falls?",
      a: "Exterior waterproofing starts at $275 per linear foot with a $4,000 minimum job, and includes excavation, membrane, drainage board and new weeping tile. Interior systems start at $120 per linear foot with a $2,800 minimum. The exact price is confirmed at a free on-site visit.",
    },
    {
      q: "Why do Chippawa homes near the river deal with wet basements differently than the rest of Niagara Falls?",
      a: "Chippawa sits where the Welland and Niagara Rivers meet, so river-adjacent properties deal with a naturally higher water table pressing on the foundation year-round, on top of Chippawa's older housing stock. It's usually a case for a higher-capacity sump system and a properly detailed exterior drainage board, not just patching a single leak.",
    },
  ],
};
