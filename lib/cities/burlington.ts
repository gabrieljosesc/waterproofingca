import type { CityPage } from "./types";

export const burlington: CityPage = {
  slug: "burlington",
  name: "Burlington",
  metaTitle: "Basement Waterproofing Burlington | 24/7 Emergency Service | DryFort",
  metaDescription:
    "Burlington basement waterproofing from $275 per linear foot. Exterior and interior systems, sump pumps, crack repair. 24/7 emergency flood response. Free written quotes.",
  heroSubhead:
    "DryFort crews serve Aldershot, Roseland, Alton Village and every Burlington neighbourhood with exterior and interior waterproofing, crack repair, and true 24/7 flood response.",

  localProblem: [
    "Burlington sees two fairly different wet-basement problems depending on where in the city you are. Along the water — Aldershot on Hamilton Bay, and Roseland and Shoreacres on the Lake Ontario shoreline — the water table sits naturally high year-round, which means constant hydrostatic pressure against a foundation rather than a leak that only shows up after a storm. Older homes in these areas were often built before that pressure was well understood in residential foundation design.",
    "Up near the escarpment, it's a newer-construction story. Alton Village, built out starting in 2006 and still one of Burlington's fastest-growing areas, sits right on the Niagara Escarpment — larger lots, modern foundations, but drainage systems that are still settling into graded fill soil the way any young subdivision's does. Established communities like Millcroft, built through the '90s and 2000s, generally sit in between: modern enough to avoid the worst of it, old enough that drainage components are starting to age.",
    "Basement flooding prevention here runs through Halton Region rather than the City of Burlington directly, and it covers Burlington, Oakville, Milton and Halton Hills under one program: the Enhanced Basement Flooding Prevention Subsidy. It covers 50% of backwater valve installation costs up to $1,600, and 100% of weeping tile disconnection paired with sump pump installation up to $6,500 — though that second, larger portion specifically requires a Halton Region-approved contractor. We'll confirm current approved-contractor status and walk you through what applies either way.",
  ],

  neighbourhoods: ["Aldershot", "Roseland", "Shoreacres", "Millcroft", "Alton Village", "Downtown Burlington"],

  subsidy: {
    programName: "Enhanced Basement Flooding Prevention Subsidy (Halton Region)",
    maxAmount: 6500,
    summary:
      "A Halton Region program covering Burlington, Oakville, Milton and Halton Hills: 50% of backwater valve installation costs (up to $1,600), and 100% of weeping tile disconnection paired with sump pump installation (up to $6,500) — the larger portion requires a Halton Region-approved contractor. Other eligible items like downspout disconnection and sewer lateral repair are also covered.",
    officialUrl:
      "https://www.halton.ca/for-residents/water-and-wastewater-services/basement-flooding/flood-preparedness-and-reducing-your-risk/backwater-valve-installation-subsidy",
  },

  serviceLines: [
    {
      slug: "exterior-waterproofing",
      line: "From waterfront homes in Aldershot to escarpment-adjacent Alton Village, we excavate and seal Burlington foundations for good.",
    },
    {
      slug: "interior-waterproofing",
      line: "For established, landscaped lots in Roseland and Shoreacres, an interior system manages constant water-table pressure without touching the yard.",
    },
    {
      slug: "emergency-flood-response",
      line: "From the Lake Ontario shoreline to the escarpment, our 24/7 line dispatches across Burlington the moment a basement starts taking on water.",
    },
    {
      slug: "sump-pump-installation",
      line: "Waterfront Burlington homes especially need a properly sized sump system — we help you apply for Halton Region's subsidy too.",
    },
    {
      slug: "foundation-crack-repair",
      line: "Constant water-table pressure near the shoreline and settling soil near the escarpment both stress Burlington foundations — we seal cracks permanently.",
    },
    {
      slug: "drainage-systems",
      line: "Whether it's aging tile near the water or still-settling drainage in newer Alton Village, we correct it so water moves away from the house.",
    },
  ],

  faqs: [
    {
      q: "Does Burlington offer a subsidy for basement flooding prevention?",
      a: "Yes, through Halton Region's Enhanced Basement Flooding Prevention Subsidy, which covers Burlington, Oakville, Milton and Halton Hills. It's 50% of backwater valve costs up to $1,600, and 100% of weeping tile disconnection with sump pump installation up to $6,500 — the larger portion requires a Halton Region-approved contractor. We confirm current approved status and help you apply.",
    },
    {
      q: "Do I need a permit for exterior waterproofing in Burlington?",
      a: "Backwater valve and weeping tile disconnection work under the Halton subsidy program has its own permit and inspection requirements. Broader exterior excavation work can also require a permit depending on scope. Simple interior crack injection generally doesn't. We confirm exactly what your job needs.",
    },
    {
      q: "How much does basement waterproofing cost in Burlington?",
      a: "Exterior waterproofing starts at $275 per linear foot with a $4,000 minimum job, and includes excavation, membrane, drainage board and new weeping tile. Interior systems start at $120 per linear foot with a $2,800 minimum. The exact price is confirmed at a free on-site visit.",
    },
    {
      q: "Why do both waterfront and escarpment-area Burlington homes get wet basements?",
      a: "They're different mechanisms with the same result. Waterfront areas like Aldershot and Roseland deal with a naturally high, constant water table pushing against the foundation. Newer escarpment-adjacent areas like Alton Village deal with drainage systems still settling into graded fill soil. One calls for a higher-capacity sump and drainage board; the other usually needs the exterior grading and weeping tile corrected.",
    },
  ],
};
