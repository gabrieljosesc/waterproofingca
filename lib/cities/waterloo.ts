import type { CityPage } from "./types";

export const waterloo: CityPage = {
  slug: "waterloo",
  name: "Waterloo",
  metaTitle: "Basement Waterproofing Waterloo | 24/7 Emergency Service | DryFort",
  metaDescription:
    "Waterloo basement waterproofing from $275 per linear foot. Exterior and interior systems, sump pumps, crack repair. 24/7 emergency flood response. Free written quotes.",
  heroSubhead:
    "DryFort crews serve Uptown Waterloo, Beechwood, Laurelwood and every Waterloo neighbourhood with exterior and interior waterproofing, crack repair, and true 24/7 flood response.",

  localProblem: [
    "Waterloo sits on the same heavy clay till common across the region, and in winter that creates a specific problem in newer subdivisions: intense frost penetrates deep into clay soil and causes adfreezing and frost heave, which is particularly hard on the shallow footings typical of newer construction in areas like Laurelwood and Beechwood. It's a different mechanism than a simple leak — the ground itself is moving against the foundation seasonally.",
    "Closer to the core, the University District and Uptown Waterloo have older homes with aging block foundations that have spent decades under constant lateral pressure from waterlogged clay. And in lower-lying Westvale, a naturally high water table means chronic basement moisture is common even without a major storm to trigger it — that's a drainage-capacity problem more than a one-time failure.",
    "We haven't found a dedicated City of Waterloo or Region of Waterloo subsidy specifically for backwater valves or sump pumps, unlike many GTA municipalities that run one — worth confirming directly with the City in case that's changed, and we'll update this page if a program appears.",
  ],

  neighbourhoods: ["Uptown Waterloo", "University District", "Beechwood", "Laurelwood", "Westvale", "Columbia Forest"],

  serviceLines: [
    {
      slug: "exterior-waterproofing",
      line: "From frost-heave-prone Laurelwood to aging block foundations near Uptown, we excavate and seal Waterloo foundations for good.",
    },
    {
      slug: "interior-waterproofing",
      line: "For Westvale's naturally high water table, an interior system with a properly sized sump manages chronic moisture without excavation.",
    },
    {
      slug: "emergency-flood-response",
      line: "From the University District to Columbia Forest, our 24/7 line dispatches across Waterloo when a basement starts taking on water.",
    },
    {
      slug: "sump-pump-installation",
      line: "We size sump systems for Waterloo's high-water-table areas like Westvale, matched to what the property actually needs.",
    },
    {
      slug: "foundation-crack-repair",
      line: "Frost heave and lateral clay pressure both stress Waterloo foundations — we inject and seal cracks so they stay sealed.",
    },
    {
      slug: "drainage-systems",
      line: "Whether it's aging tile near Uptown or high groundwater in Westvale, we correct the drainage system so water moves away from the house.",
    },
  ],

  faqs: [
    {
      q: "Does Waterloo offer a subsidy for basement flooding prevention?",
      a: "We haven't found a dedicated City of Waterloo or Region of Waterloo program for backwater valves or sump pumps, which puts Waterloo in a different position than many GTA municipalities that do run one. Worth confirming directly with the City in case that's changed — we'll update this page if a program appears.",
    },
    {
      q: "Do I need a permit for exterior waterproofing in Waterloo?",
      a: "Exterior work involving excavation can require a building permit depending on scope, and backwater valve installation typically does. Simple interior crack injection generally doesn't. We confirm exactly what your job needs and handle the permit process.",
    },
    {
      q: "How much does basement waterproofing cost in Waterloo?",
      a: "Exterior waterproofing starts at $275 per linear foot with a $4,000 minimum job, and includes excavation, membrane, drainage board and new weeping tile. Interior systems start at $120 per linear foot with a $2,800 minimum. The exact price is confirmed at a free on-site visit.",
    },
    {
      q: "Why do newer Waterloo subdivisions like Laurelwood still get foundation problems?",
      a: "It's frost, not age. Waterloo's clay-heavy soil lets winter frost penetrate deep and push against shallow footings through a process called frost heave — a newer foundation isn't immune to it the way it would be to a collapsed old pipe. It's a different fix than what an older Uptown home needs, but it's just as real.",
    },
  ],
};
