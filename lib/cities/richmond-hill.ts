import type { CityPage } from "./types";

export const richmondHill: CityPage = {
  slug: "richmond-hill",
  name: "Richmond Hill",
  metaTitle: "Basement Waterproofing Richmond Hill | 24/7 Emergency Service | DryFort",
  metaDescription:
    "Richmond Hill basement waterproofing from $275 per linear foot. Exterior and interior systems, sump pumps, crack repair. 24/7 emergency flood response. Free written quotes.",
  heroSubhead:
    "DryFort crews serve Oak Ridges, Mill Pond, Bayview Hill and every Richmond Hill neighbourhood with exterior and interior waterproofing, crack repair, and true 24/7 flood response.",

  localProblem: [
    "Richmond Hill is really two different waterproofing problems living in one city. In heritage areas like Mill Pond, homes are old enough that original clay weeping tile has had decades to corrode and collapse — the same story as Toronto's older neighbourhoods. A few kilometres away in Jefferson, a newer master-planned community built out through the 2000s and 2010s, the foundations are modern but the surrounding drainage is still settling into the graded fill soil — the same story as Vaughan's newest subdivisions. We treat them differently because they usually need different fixes.",
    "There's also something specific to Richmond Hill's geography: much of the city sits on or near the Oak Ridges Moraine, a band of sand and gravel over clay till that acts as a groundwater headwater area for several rivers, including the Rouge and the Don. That geology means groundwater levels move more with the seasons here than in a lot of the GTA — basements that stay dry all summer can start taking on water during spring thaw or after a heavy fall rain, simply because the water table underneath the property has risen.",
    "On the municipal side, Richmond Hill runs a Backwater Valve Subsidy Program covering up to $1,500 toward installation, for existing homes only — new builds still under construction aren't eligible. It requires a licensed Ontario College of Trades contractor, a building permit with a follow-up plumbing inspection, and disconnecting eaves trough downspouts from the sewer system as a condition of the subsidy.",
  ],

  neighbourhoods: ["Oak Ridges", "Mill Pond", "Bayview Hill", "Jefferson", "South Richvale", "Doncrest"],

  subsidy: {
    programName: "Backwater Valve Subsidy Program",
    maxAmount: 1500,
    summary:
      "Up to $1,500 toward the cost of installing a backwater valve, for existing single-family, duplex or triplex homes (new builds under construction aren't eligible). Requires a licensed Ontario College of Trades contractor, a building permit and plumbing inspection, and disconnecting eaves trough downspouts from the sewer system.",
    officialUrl: "https://www.richmondhill.ca/en/online-services/backwater-valve-subsidy-program.aspx",
  },

  serviceLines: [
    {
      slug: "exterior-waterproofing",
      line: "From heritage foundations in Mill Pond to newer builds in Jefferson, we excavate and seal Richmond Hill homes for good.",
    },
    {
      slug: "interior-waterproofing",
      line: "On mature, landscaped lots in areas like South Richvale, an interior system fixes the leak without touching established gardens.",
    },
    {
      slug: "emergency-flood-response",
      line: "Spring thaw and heavy rain both push groundwater up fast here — our 24/7 line covers every Richmond Hill neighbourhood.",
    },
    {
      slug: "sump-pump-installation",
      line: "With Richmond Hill's seasonal groundwater swings, a properly sized sump system matters more than in most GTA cities — we help you apply for the City's subsidy too.",
    },
    {
      slug: "foundation-crack-repair",
      line: "Freeze-thaw cycles and shifting groundwater both stress Richmond Hill foundations — we inject and seal cracks permanently.",
    },
    {
      slug: "drainage-systems",
      line: "Whether it's collapsed clay tile in Mill Pond or still-settling drainage in Jefferson, we correct it so water moves away from the house.",
    },
  ],

  faqs: [
    {
      q: "Does Richmond Hill offer a subsidy for backwater valve installation?",
      a: "Yes. The City's Backwater Valve Subsidy Program covers up to $1,500 toward installation for existing homes — new builds under construction aren't eligible. It requires a licensed Ontario College of Trades contractor, a building permit with a follow-up plumbing inspection, and disconnecting your eaves trough downspouts from the sewer system.",
    },
    {
      q: "Do I need a permit for exterior waterproofing in Richmond Hill?",
      a: "Backwater valve installation specifically requires a building permit and a City plumbing inspection. Broader exterior excavation work can also require a permit depending on scope. Simple interior crack injection generally doesn't. We confirm exactly what your job needs and handle the permit process.",
    },
    {
      q: "How much does basement waterproofing cost in Richmond Hill?",
      a: "Exterior waterproofing starts at $275 per linear foot with a $4,000 minimum job, and includes excavation, membrane, drainage board and new weeping tile. Interior systems start at $120 per linear foot with a $2,800 minimum. The exact price is confirmed at a free on-site visit.",
    },
    {
      q: "Why do some Richmond Hill basements only leak in spring?",
      a: "A lot of Richmond Hill sits on or near the Oak Ridges Moraine, where groundwater levels shift more with the seasons than in much of the GTA. A basement that's bone dry all summer can start taking on water during spring thaw simply because the water table underneath the property has risen — it doesn't always mean something is newly broken, but it does mean the drainage system needs to handle that seasonal swing.",
    },
  ],
};
