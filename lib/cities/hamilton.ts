import type { CityPage } from "./types";

export const hamilton: CityPage = {
  slug: "hamilton",
  name: "Hamilton",
  metaTitle: "Basement Waterproofing Hamilton | 24/7 Emergency Service | DryFort",
  metaDescription:
    "Hamilton basement waterproofing from $275 per linear foot. Exterior and interior systems, sump pumps, crack repair. 24/7 emergency flood response. Free written quotes.",
  heroSubhead:
    "DryFort crews serve Dundas, Ancaster, Stoney Creek and every Hamilton neighbourhood with exterior and interior waterproofing, crack repair, and true 24/7 flood response.",

  localProblem: [
    "Hamilton's geography works against it during a storm. During heavy rain, a huge volume of water comes down the escarpment toward the lower city, and a lot of the lower city's sewer infrastructure was built long before anyone was sizing pipes for today's storm volumes. Without a backwater valve, a home downstream of that runoff is effectively part of the system's overflow capacity.",
    "The City has identified roughly 900 flooding hot spots across Hamilton, and some of the highest concentrations sit in Dundas, Ancaster and Binbrook — a reminder that this isn't just a lower-city, older-home problem; sloped terrain and local drainage capacity matter as much as a neighbourhood's age.",
    "Hamilton runs a Protective Plumbing Program (3P): a grant of up to $2,000 toward a backwater valve, sump pump and downspout disconnection — but only when the installation uses a contractor from the City's pre-qualified list. Using an outside contractor caps the backwater valve portion at $500. A CCTV drainage inspection is required for every application, along with a building permit (its cost is reimbursed separately). We'll confirm current pre-qualified status before your job and walk you through exactly what you'd qualify for either way.",
  ],

  neighbourhoods: ["Dundas", "Ancaster", "Stoney Creek", "Waterdown", "Binbrook", "Hamilton Mountain"],

  subsidy: {
    programName: "Protective Plumbing Program (3P)",
    maxAmount: 2000,
    summary:
      "Up to $2,000 toward a backwater valve, sump pump and downspout disconnection — but only when installed by a contractor on the City's pre-qualified list. An outside contractor caps the backwater valve portion at $500. Requires a CCTV drainage inspection and a building permit (permit cost reimbursed separately).",
    officialUrl: "https://www.hamilton.ca/home-neighbourhood/home-property/basement-flooding/protective-plumbing-program",
  },

  serviceLines: [
    {
      slug: "exterior-waterproofing",
      line: "From lower-city homes catching escarpment runoff to Ancaster properties on sloped lots, we excavate and seal Hamilton foundations for good.",
    },
    {
      slug: "interior-waterproofing",
      line: "On established lots in Dundas and Stoney Creek where excavation isn't practical, an interior system captures the water without disturbing the yard.",
    },
    {
      slug: "emergency-flood-response",
      line: "Escarpment runoff can hit the lower city fast during a storm — our 24/7 line dispatches across Hamilton the moment a basement starts taking on water.",
    },
    {
      slug: "sump-pump-installation",
      line: "We size sump systems for Hamilton's drainage hot spots and walk you through exactly what the City's 3P Program would cover for your job.",
    },
    {
      slug: "foundation-crack-repair",
      line: "Sloped terrain and older lower-city infrastructure both put pressure on Hamilton foundations — we inject and seal cracks permanently.",
    },
    {
      slug: "drainage-systems",
      line: "Aging weeping tile in Hamilton's older neighbourhoods can't keep up with modern storm volumes — we replace it and correct grading around the house.",
    },
  ],

  faqs: [
    {
      q: "Does Hamilton offer a subsidy for backwater valve installation?",
      a: "Yes, through the Protective Plumbing Program (3P) — up to $2,000 toward a backwater valve, sump pump and downspout disconnection when installed by a City pre-qualified contractor. Using a contractor outside that list caps the backwater valve portion at $500. A CCTV drainage inspection and building permit are both required. We'll confirm current pre-qualified status and walk you through what applies to your job.",
    },
    {
      q: "Do I need a permit for exterior waterproofing in Hamilton?",
      a: "Backwater valve installation under the 3P Program requires a building permit. Broader exterior excavation work can also require one depending on scope. Simple interior crack injection generally doesn't. We confirm exactly what your job needs and handle the permit process.",
    },
    {
      q: "How much does basement waterproofing cost in Hamilton?",
      a: "Exterior waterproofing starts at $275 per linear foot with a $4,000 minimum job, and includes excavation, membrane, drainage board and new weeping tile. Interior systems start at $120 per linear foot with a $2,800 minimum. The exact price is confirmed at a free on-site visit.",
    },
    {
      q: "Why does Hamilton get so much basement flooding?",
      a: "Two things stack up: a large volume of stormwater runs down the escarpment toward the lower city during heavy rain, and a lot of that area's sewer infrastructure predates modern storm volumes. The City has identified roughly 900 flooding hot spots citywide — including in Dundas, Ancaster and Binbrook, which shows sloped terrain and local drainage matter as much as a home's age.",
    },
  ],
};
