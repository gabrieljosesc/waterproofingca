import type { CityPage } from "./types";

export const london: CityPage = {
  slug: "london",
  name: "London",
  metaTitle: "Basement Waterproofing London | 24/7 Emergency Service | DryFort",
  metaDescription:
    "London Ontario basement waterproofing from $275 per linear foot. Exterior and interior systems, sump pumps, crack repair. 24/7 emergency flood response. Free written quotes.",
  heroSubhead:
    "DryFort crews serve Old South, Wortley Village, Old North and every London neighbourhood with exterior and interior waterproofing, crack repair, and true 24/7 flood response.",

  localProblem: [
    "London's flood history is well documented going back to 1791, and the worst of it — the Flood of '37 — is still the reference point conservation authorities use today: the highest water ever recorded on the Thames River, five deaths, roughly 1,100 homes ruined, and $3 million in property damage, hitting Blackfriars, Broughdale and North London hardest. The City has since built dyke systems, including the West London Dyke protecting over 1,000 structures, but the underlying geography hasn't changed.",
    "Modern basement flooding risk maps a bit differently: Old South, Wortley Village, Woodfield and Hamilton Road are classified as higher risk, largely because many homes built before 1985 in these areas have weeping tile connected directly to the municipal sanitary sewer. During a major storm, the sewer system can back up through that connection and send sewage-contaminated water out through basement floor drains — which is exactly what a backwater valve is designed to stop.",
    "London's Basement Flooding Grant Program covers 90% of costs: a backwater valve up to $1,800, weeping tile disconnection to a new sump pit and pump up to $4,000, a battery backup up to $1,400, or a sewage ejector and holding tank up to $6,000 as an alternative to a backwater valve. It's not open to every homeowner proactively — you generally need to have already experienced basement flooding, be in an area the City has identified as prone to sanitary-main backup, or have documented sump discharge issues. We'll help you confirm which category applies before you apply.",
  ],

  neighbourhoods: ["Old South", "Wortley Village", "Old North", "Woodfield", "Hamilton Road", "Blackfriars"],

  subsidy: {
    programName: "Basement Flooding Grant Program",
    maxAmount: 6000,
    summary:
      "90% of costs: backwater valve up to $1,800, weeping tile disconnection to a new sump pit and pump up to $4,000, battery backup up to $1,400, or a sewage ejector and holding tank up to $6,000 as an alternative to a backwater valve. Eligibility requires having already experienced basement flooding, being in an area the City has identified as prone to sanitary-main backup, or documented sump discharge issues — it isn't open to every homeowner proactively.",
    officialUrl: "https://london.ca/living-london/water-environment/flooding/basement-flooding-grant-program",
  },

  serviceLines: [
    {
      slug: "exterior-waterproofing",
      line: "From pre-1985 homes in Old South to Old North's established streets, we excavate and seal London foundations for good.",
    },
    {
      slug: "interior-waterproofing",
      line: "On mature lots in Wortley Village, an interior system fixes the leak without disturbing established landscaping.",
    },
    {
      slug: "emergency-flood-response",
      line: "From the Thames River flats to Hamilton Road, our 24/7 line dispatches across London when a basement starts taking on water.",
    },
    {
      slug: "sump-pump-installation",
      line: "We size sump systems for London's higher-risk sanitary-main areas and help you apply for the City's grant program.",
    },
    {
      slug: "foundation-crack-repair",
      line: "Older foundations across London's flood-mapped neighbourhoods see real pressure — we inject and seal cracks permanently.",
    },
    {
      slug: "drainage-systems",
      line: "Pre-1985 weeping tile connected directly to the sanitary sewer is a known risk factor in London — we correct it properly.",
    },
  ],

  faqs: [
    {
      q: "Does London offer a subsidy for basement flooding prevention?",
      a: "Yes, but it's not open to everyone proactively. The Basement Flooding Grant Program covers 90% of costs — backwater valve up to $1,800, weeping tile disconnection with a new sump pump up to $4,000, battery backup up to $1,400 — but you generally need to have already experienced basement flooding or be in an area the City has flagged as prone to sanitary-main backup. We'll help confirm your eligibility before you apply.",
    },
    {
      q: "Do I need a permit for exterior waterproofing in London?",
      a: "Backwater valve installation under the grant program has its own permit and inspection requirements. Broader exterior excavation work can also require a permit depending on scope. Simple interior crack injection generally doesn't. We confirm exactly what your job needs.",
    },
    {
      q: "How much does basement waterproofing cost in London?",
      a: "Exterior waterproofing starts at $275 per linear foot with a $4,000 minimum job, and includes excavation, membrane, drainage board and new weeping tile. Interior systems start at $120 per linear foot with a $2,800 minimum. The exact price is confirmed at a free on-site visit.",
    },
    {
      q: "Why are Old South, Wortley Village and Hamilton Road considered higher risk for basement flooding?",
      a: "Many homes built before 1985 in these areas have weeping tile connected directly to the municipal sanitary sewer rather than a separate storm system. During a major storm, the sewer can surcharge and push water — including sewage — back up through that connection and out through basement floor drains. A backwater valve is specifically designed to stop that, which is why it's the City's top-funded item in these neighbourhoods.",
    },
  ],
};
