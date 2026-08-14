import type { CityPage } from "./types";

export const oakville: CityPage = {
  slug: "oakville",
  name: "Oakville",
  metaTitle: "Basement Waterproofing Oakville | 24/7 Emergency Service | DryFort",
  metaDescription:
    "Oakville basement waterproofing from $275 per linear foot. Exterior and interior systems, sump pumps, crack repair. 24/7 emergency flood response. Free written quotes.",
  heroSubhead:
    "DryFort crews serve Old Oakville, Bronte, Glen Abbey and every Oakville neighbourhood with exterior and interior waterproofing, crack repair, and true 24/7 flood response.",

  localProblem: [
    "Oakville's older neighbourhoods have a specific problem that newer ones don't: mature tree roots. Old Oakville and Bronte are known for exactly the tree canopy that makes them desirable, but those same roots find their way into original clay weeping tile over the decades, cracking and clogging pipe that was already at the end of its service life. It's a different failure mode than a straightforward clay-soil collapse — root infiltration tends to be gradual and easy to miss until a wall is visibly damp.",
    "Further from the lake, Glen Abbey, River Oaks and West Oak Trails sit on clay-rich soil that expands significantly when saturated — clay can swell 10 to 15% with enough moisture, and that swelling pushes directly against foundation walls during and after heavy rain. Add Oakville's proximity to Sixteen Mile Creek's ravine system, and groundwater levels in parts of town can shift faster than homeowners expect, putting extra stress on foundations that otherwise look fine.",
    "Basement flooding subsidies here run through Halton Region rather than the Town of Oakville directly, the same program that covers Burlington, Milton and Halton Hills: the Enhanced Basement Flooding Prevention Subsidy. It covers 50% of backwater valve installation costs up to $1,600, and 100% of weeping tile disconnection paired with sump pump installation up to $6,500 — that larger portion requires a Halton Region-approved contractor. We'll confirm current approved status and walk you through what applies to your job.",
  ],

  neighbourhoods: ["Old Oakville", "Bronte", "Glen Abbey", "River Oaks", "West Oak Trails", "Downtown Oakville"],

  subsidy: {
    programName: "Enhanced Basement Flooding Prevention Subsidy (Halton Region)",
    maxAmount: 6500,
    summary:
      "A Halton Region program covering Oakville, Burlington, Milton and Halton Hills: 50% of backwater valve installation costs (up to $1,600), and 100% of weeping tile disconnection paired with sump pump installation (up to $6,500) — the larger portion requires a Halton Region-approved contractor. Other eligible items like downspout disconnection and sewer lateral repair are also covered.",
    officialUrl:
      "https://www.halton.ca/for-residents/water-and-wastewater-services/basement-flooding/flood-preparedness-and-reducing-your-risk/backwater-valve-installation-subsidy",
  },

  serviceLines: [
    {
      slug: "exterior-waterproofing",
      line: "From root-damaged clay tile in Bronte to clay-soil pressure in Glen Abbey, we excavate and seal Oakville foundations for good.",
    },
    {
      slug: "interior-waterproofing",
      line: "On mature, tree-lined lots in Old Oakville, an interior system fixes the leak without disturbing established roots or landscaping.",
    },
    {
      slug: "emergency-flood-response",
      line: "From the Sixteen Mile Creek ravine system to the lakeshore, our 24/7 line dispatches across Oakville when a basement starts taking on water.",
    },
    {
      slug: "sump-pump-installation",
      line: "We size sump systems for Oakville's clay-soil and ravine-adjacent properties, and help you apply for Halton Region's subsidy.",
    },
    {
      slug: "foundation-crack-repair",
      line: "Expanding clay soil puts real seasonal pressure on Oakville foundations — we inject and seal cracks so they stay sealed.",
    },
    {
      slug: "drainage-systems",
      line: "Root-damaged clay weeping tile is common in Oakville's older, tree-lined neighbourhoods — we replace it and correct grading around the house.",
    },
  ],

  faqs: [
    {
      q: "Does Oakville offer a subsidy for basement flooding prevention?",
      a: "Yes, through Halton Region's Enhanced Basement Flooding Prevention Subsidy, which covers Oakville, Burlington, Milton and Halton Hills. It's 50% of backwater valve costs up to $1,600, and 100% of weeping tile disconnection with sump pump installation up to $6,500 — the larger portion requires a Halton Region-approved contractor. We confirm current approved status and help you apply.",
    },
    {
      q: "Do I need a permit for exterior waterproofing in Oakville?",
      a: "Backwater valve and weeping tile disconnection work under the Halton subsidy program has its own permit and inspection requirements. Broader exterior excavation work can also require a permit depending on scope. Simple interior crack injection generally doesn't. We confirm exactly what your job needs.",
    },
    {
      q: "How much does basement waterproofing cost in Oakville?",
      a: "Exterior waterproofing starts at $275 per linear foot with a $4,000 minimum job, and includes excavation, membrane, drainage board and new weeping tile. Interior systems start at $120 per linear foot with a $2,800 minimum. The exact price is confirmed at a free on-site visit.",
    },
    {
      q: "Why do tree-lined Oakville neighbourhoods like Old Oakville and Bronte get wet basements?",
      a: "The same mature tree canopy that makes these neighbourhoods desirable also means old clay weeping tile has had decades for roots to find their way in, cracking and clogging pipe that's often already near the end of its service life. It tends to be gradual — a wall can look fine for years before it's visibly damp — so we always check drainage condition, not just the visible crack.",
    },
  ],
};
