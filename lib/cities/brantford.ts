import type { CityPage } from "./types";

export const brantford: CityPage = {
  slug: "brantford",
  name: "Brantford",
  metaTitle: "Basement Waterproofing Brantford | 24/7 Emergency Service | DryFort",
  metaDescription:
    "Brantford basement waterproofing from $275 per linear foot. Exterior and interior systems, sump pumps, crack repair. 24/7 emergency flood response. Free written quotes.",
  heroSubhead:
    "DryFort crews serve Eagle Place, Holmedale, West Brant and every Brantford neighbourhood with exterior and interior waterproofing, crack repair, and true 24/7 flood response.",

  localProblem: [
    "Brantford's relationship with water is well documented, not theoretical. In February 2018, an ice jam broke away upstream of the Parkhill Dam and sent a surge of water down the Grand River, triggering a state of emergency and evacuation orders across Holmedale, Eagle Place and Old West Brant — roughly 2,200 homes affected. It followed similar flood levels seen in June 2017. If your property is in one of these low-lying, river-adjacent neighbourhoods, backwater protection isn't a nice-to-have.",
    "Away from the river, neighbourhoods like Brier Park and Henderson Survey sit on higher, drier ground with mature streetscapes and larger lots — the waterproofing needs there tend to be more about aging weeping tile than river-driven groundwater, a genuinely different problem with a different fix.",
    "The City's Basement Flooding Prevention Grant covers 80% of costs up to $5,000 per household: an internal backwater valve up to $3,000, an external backwater valve up to $5,000, a new sump pit and battery-backup pump up to $4,000 (new installations only — replacements aren't eligible), and downspout disconnection up to $500. Disconnecting your downspouts from the sewer system is actually mandatory to qualify for any of it, and a plumbing permit ($105) is required for backwater valve work. The program was reactivated in 2024 after a major rainfall event and got additional funding in mid-2026, so it's active and worth applying to.",
  ],

  neighbourhoods: ["Eagle Place", "Holmedale", "West Brant", "Echo Place", "Brier Park", "Henderson Survey"],

  subsidy: {
    programName: "Basement Flooding Prevention Grant",
    maxAmount: 5000,
    summary:
      "80% of costs, up to $5,000 per household: internal backwater valve (up to $3,000), external backwater valve (up to $5,000), new sump pit and battery-backup pump (up to $4,000, new installs only), and downspout disconnection (up to $500, mandatory to qualify for any grant). A plumbing permit ($105) is required for backwater valve installation.",
    officialUrl: "https://www.brantford.ca/living-here/utilities-and-water/stormwater/basement-flooding-prevention-grant-program/",
  },

  serviceLines: [
    {
      slug: "exterior-waterproofing",
      line: "From river-adjacent Eagle Place to higher ground in Brier Park, we excavate and seal Brantford foundations for good.",
    },
    {
      slug: "interior-waterproofing",
      line: "On established lots in Henderson Survey, an interior system fixes the leak without disturbing mature landscaping.",
    },
    {
      slug: "emergency-flood-response",
      line: "Grand River surge events have hit Brantford before — our 24/7 line dispatches across the city when a basement starts taking on water.",
    },
    {
      slug: "sump-pump-installation",
      line: "We size sump systems with battery backup for river-adjacent Brantford properties and help you apply for the City's grant.",
    },
    {
      slug: "foundation-crack-repair",
      line: "River-driven groundwater and older housing stock both put pressure on Brantford foundations — we inject and seal cracks permanently.",
    },
    {
      slug: "drainage-systems",
      line: "Aging weeping tile is common in Brantford's older, river-adjacent neighbourhoods — we replace it and correct grading around the house.",
    },
  ],

  faqs: [
    {
      q: "Does Brantford offer a subsidy for basement flooding prevention?",
      a: "Yes. The Basement Flooding Prevention Grant covers 80% of costs up to $5,000 per household — internal backwater valve up to $3,000, external up to $5,000, a new sump pit and battery-backup pump up to $4,000, and downspout disconnection up to $500 (mandatory to qualify for anything else). We identify what your job qualifies for and help you apply.",
    },
    {
      q: "Do I need a permit for exterior waterproofing in Brantford?",
      a: "Backwater valve installation under the grant program requires a plumbing permit ($105 fee). Broader exterior excavation work can also require a permit depending on scope. Simple interior crack injection generally doesn't. We confirm exactly what your job needs and handle the permit process.",
    },
    {
      q: "How much does basement waterproofing cost in Brantford?",
      a: "Exterior waterproofing starts at $275 per linear foot with a $4,000 minimum job, and includes excavation, membrane, drainage board and new weeping tile. Interior systems start at $120 per linear foot with a $2,800 minimum. The exact price is confirmed at a free on-site visit.",
    },
    {
      q: "Why are Eagle Place, Holmedale and West Brant more flood-prone than other Brantford neighbourhoods?",
      a: "They sit low and close to the Grand River, and Brantford has real, recent history to prove it — a February 2018 ice jam upstream of the Parkhill Dam caused a surge that triggered a state of emergency and evacuated roughly 2,200 homes in exactly these areas. A backwater valve and a properly sized sump system matter more here than almost anywhere else on our service list.",
    },
  ],
};
