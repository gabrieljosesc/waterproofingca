import type { CityPage } from "./types";

export const vaughan: CityPage = {
  slug: "vaughan",
  name: "Vaughan",
  metaTitle: "Basement Waterproofing Vaughan | 24/7 Emergency Service | DryFort",
  metaDescription:
    "Vaughan basement waterproofing from $275 per linear foot. Exterior and interior systems, sump pumps, crack repair. 24/7 emergency flood response. Free written quotes.",
  heroSubhead:
    "DryFort crews serve Woodbridge, Maple, Kleinburg and every Vaughan neighbourhood with exterior and interior waterproofing, crack repair, and true 24/7 flood response.",

  localProblem: [
    "Vaughan's problem looks different from an older city's, but it's just as real. A lot of the housing stock in Patterson, Vellore Village and Maple is newer — poured concrete foundations built to modern code — and homeowners often assume that means a dry basement is a given. It isn't. Whole subdivisions were built and graded on the same schedule, on the same fill soil, and as that soil settles unevenly over the following years, the drainage the builder engineered on paper stops matching what's actually happening on the ground.",
    "The two patterns we see most in Vaughan: undersized or improperly sloped weeping tile that couldn't keep up once the soil settled, and leaks at cold joints, tie-holes and window wells on foundations that are otherwise in good structural shape. Neither is a sign of a badly built house — it's a sign that the drainage system around it needs correcting, which is a very different (and usually less invasive) fix than what an older home with collapsed clay tile needs.",
    "On the municipal side, Vaughan runs a Back-Water Valve Subsidy Program: 50% of the invoiced cost of installing an approved back-water valve, up to $750, for existing homes (homes still under construction aren't eligible). It requires a certified plumber and a permit from Vaughan's Building Standards Department before installation. It's first-come, first-served subject to available funding, so it's worth applying as soon as the work is scheduled, not after.",
  ],

  neighbourhoods: ["Woodbridge", "Maple", "Kleinburg", "Vellore Village", "Patterson", "Concord"],

  subsidy: {
    programName: "Back-Water Valve Subsidy Program",
    maxAmount: 750,
    summary:
      "50% of the invoiced cost of installing an approved back-water valve, up to a maximum of $750, for existing homes (new builds under construction aren't eligible). Requires a certified plumber and a permit from Vaughan's Building Standards Department; funding is first-come, first-served.",
    officialUrl:
      "https://www.vaughan.ca/residential/water-wastewater-and-stormwater/wastewater-services/sanitary-back-water-valve",
  },

  serviceLines: [
    {
      slug: "exterior-waterproofing",
      line: "For Vaughan foundations dealing with settled fill soil and undersized drainage, a full exterior system corrects what the original grading didn't.",
    },
    {
      slug: "interior-waterproofing",
      line: "On newer Vaughan lots with tight setbacks and finished landscaping, an interior system fixes the leak without touching the yard.",
    },
    {
      slug: "emergency-flood-response",
      line: "From Woodbridge to Kleinburg, our 24/7 line dispatches across Vaughan the moment a basement starts taking on water.",
    },
    {
      slug: "sump-pump-installation",
      line: "We size sump systems for Vaughan's newer builds and help you apply for the City's back-water valve subsidy.",
    },
    {
      slug: "foundation-crack-repair",
      line: "Cold-joint and tie-hole leaks are common even in Vaughan's newer poured foundations — we seal them permanently.",
    },
    {
      slug: "drainage-systems",
      line: "Undersized or poorly sloped weeping tile is the most common cause of wet basements in Vaughan's newer subdivisions — we correct it.",
    },
  ],

  faqs: [
    {
      q: "Does Vaughan offer a subsidy for backwater valve installation?",
      a: "Yes. The City's Back-Water Valve Subsidy Program covers 50% of the invoiced cost, up to $750, for existing homes — homes still under construction aren't eligible. It requires a certified plumber and a permit from Vaughan's Building Standards Department, and funding is first-come, first-served, so we recommend applying as soon as the installation is scheduled.",
    },
    {
      q: "Do I need a permit for exterior waterproofing in Vaughan?",
      a: "Backwater valve installation specifically requires a permit from Vaughan's Building Standards Department. Broader exterior excavation work can also require one depending on scope. Simple interior crack injection generally doesn't. We confirm exactly what your job needs and handle the permit as part of the process.",
    },
    {
      q: "How much does basement waterproofing cost in Vaughan?",
      a: "Exterior waterproofing starts at $275 per linear foot with a $4,000 minimum job, and includes excavation, membrane, drainage board and new weeping tile. Interior systems start at $120 per linear foot with a $2,800 minimum. The exact price is confirmed at a free on-site visit.",
    },
    {
      q: "Why do newer Vaughan homes still get wet basements?",
      a: "A new foundation isn't the same as finished drainage. In fast-built subdivisions like Patterson and Vellore Village, fill soil settles unevenly over the years after construction, which can leave weeping tile undersized or poorly sloped for the ground it's actually sitting in. The foundation itself is usually fine — it's the drainage around it that needs correcting, which is often a smaller job than homeowners expect.",
    },
  ],
};
