import type { CityPage } from "./types";

export const mississauga: CityPage = {
  slug: "mississauga",
  name: "Mississauga",
  metaTitle: "Basement Waterproofing Mississauga | 24/7 Emergency Service | DryFort",
  metaDescription:
    "Mississauga basement waterproofing from $275 per linear foot. Exterior and interior systems, sump pumps, crack repair. 24/7 emergency flood response. Free written quotes.",
  heroSubhead:
    "DryFort crews serve Port Credit, Lakeview, Clarkson and every Mississauga neighbourhood with exterior and interior waterproofing, crack repair, and true 24/7 flood response.",

  localProblem: [
    "Most of Mississauga sits on heavy Peel clay, which holds water against a foundation wall instead of letting it drain away — that alone accounts for a lot of the calls we get. It's compounded in older neighbourhoods like Lakeview, Clarkson, Cooksville and Applewood, built mostly through the 1950s to 1970s, where the original clay or \"Big O\" weeping tile has had 50-plus years to collapse or clog with silt.",
    "Waterfront areas add a second factor. Port Credit and Lakeview sit close enough to the Lake Ontario shoreline that the water table is naturally high there year-round, not just after a storm — that's constant hydrostatic pressure pushing against basement walls, which is a different problem than a one-time collapsed pipe and usually needs a higher-capacity sump system and a properly detailed drainage board to manage long-term, not just a patch.",
    "On the municipal side, Mississauga runs a Basement Flooding Prevention Rebate — up to $7,500 total per property, made up of per-item caps: sump pump ($6,000), foundation drain pipe capping ($1,000), storm lateral backwater valve ($1,500), and downspout disconnection ($125 each, up to $500). It replaced the older Foundation Drain Collector Sump Pump Subsidy Program, so if that's the name you've seen elsewhere, this is the current version. It runs as a two-step process — pre-approval before work starts, final approval with invoices after — so we build that into your project timeline from the start.",
  ],

  neighbourhoods: ["Port Credit", "Lakeview", "Clarkson", "Cooksville", "Applewood", "Streetsville"],

  subsidy: {
    programName: "Basement Flooding Prevention Rebate",
    maxAmount: 7500,
    summary:
      "Up to $7,500 total per property: sump pump (max $6,000), foundation drain pipe capping (max $1,000), storm lateral backwater valve (max $1,500), and downspout disconnection ($125 each, up to $500). Requires pre-approval before work starts and final approval with invoices within 6 months of completion; building permits required for foundation drain capping and backwater valve installation.",
    officialUrl:
      "https://www.mississauga.ca/services-and-programs/home-and-yard/stormwater/apply-for-a-basement-flooding-prevention-rebate/",
  },

  serviceLines: [
    {
      slug: "exterior-waterproofing",
      line: "From clay-soil foundations in Cooksville to waterfront homes in Port Credit, we excavate and seal Mississauga foundations for good.",
    },
    {
      slug: "interior-waterproofing",
      line: "For mature lots in Lakeview and Clarkson where excavation isn't practical, an interior system captures the water without disturbing the yard.",
    },
    {
      slug: "emergency-flood-response",
      line: "From Streetsville to the Port Credit shoreline, our 24/7 line dispatches across Mississauga when a basement takes on water.",
    },
    {
      slug: "sump-pump-installation",
      line: "Waterfront-area homes especially need a properly sized sump system for constant hydrostatic pressure — we size it right and help you apply for the City's rebate.",
    },
    {
      slug: "foundation-crack-repair",
      line: "Heavy clay soil puts real pressure on Mississauga foundations — we inject and seal cracks so they stay sealed.",
    },
    {
      slug: "drainage-systems",
      line: "Collapsed clay or Big O weeping tile is common in Mississauga's older neighbourhoods — we replace it and correct grading so water moves away from the house.",
    },
  ],

  faqs: [
    {
      q: "Does Mississauga offer a subsidy for basement flooding prevention?",
      a: "Yes. The Basement Flooding Prevention Rebate covers up to $7,500 total: sump pump (max $6,000), foundation drain pipe capping (max $1,000), backwater valve (max $1,500), and downspout disconnection (up to $500). It's a two-step process — pre-approval before work starts, then final approval with invoices — and it's the current version of what used to be called the Foundation Drain Collector Sump Pump Subsidy. We identify what your job qualifies for and help you apply.",
    },
    {
      q: "Do I need a permit for exterior waterproofing in Mississauga?",
      a: "Foundation drain pipe capping and backwater valve installation both require a building permit under the City's rebate program. Broader exterior excavation work can also require one depending on scope. Simple interior crack injection generally doesn't. We confirm exactly what your job needs and handle the permit process.",
    },
    {
      q: "How much does basement waterproofing cost in Mississauga?",
      a: "Exterior waterproofing starts at $275 per linear foot with a $4,000 minimum job, and includes excavation, membrane, drainage board and new weeping tile. Interior systems start at $120 per linear foot with a $2,800 minimum. The exact price is confirmed at a free on-site visit.",
    },
    {
      q: "Why do Port Credit and Lakeview basements deal with water differently than the rest of Mississauga?",
      a: "Their proximity to the Lake Ontario shoreline means a naturally high water table year-round, not just after a storm — that's constant hydrostatic pressure against the foundation rather than a one-time leak. It usually calls for a higher-capacity sump system and a properly detailed exterior drainage board, not just a patch on a collapsed pipe.",
    },
  ],
};
