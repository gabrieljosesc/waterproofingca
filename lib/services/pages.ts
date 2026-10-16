import { images, site } from "@/lib/site";

/**
 * Per-service page content for /services/<slug>. The short card copy,
 * feature bullets and the service list itself live in `services` in
 * lib/site.ts; this adds what a full page needs — a longer explanation,
 * the crew's process, photos, pricing and FAQs.
 *
 * Photos in /public/images/services are the client's own job photos.
 */

export interface ServicePhoto {
  src: string;
  alt: string;
  caption: string;
}

export interface ServicePageContent {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  heroAlt: string;
  heroLead: string;
  intro: string[];
  processTitle: string;
  steps: { title: string; text: string }[];
  gallery: ServicePhoto[];
  pricing?: { figure: string; unit: string; note: string };
  faqs: { q: string; a: string }[];
  /** Show the crack-repair explainer video in place of the photo gallery. */
  showCrackRepairVideo?: boolean;
}

const img = (file: string) => `/images/services/${file}`;

const photos = {
  membrane: {
    src: img("rubberized-membrane.jpg"),
    alt: "Technician rolling rubberized waterproof membrane onto an exposed foundation wall",
    caption: "Rubberized membrane — the actual waterproof seal",
  },
  dimpleInstall: {
    src: img("dimple-board-install.jpg"),
    alt: "Dimpled drainage board being fastened over the membrane on a foundation wall",
    caption: "Dimple board protects the membrane and gives water a path down",
  },
  drainage: {
    src: img("exterior-drainage-dimple-board.jpg"),
    alt: "Perforated weeping tile being levelled in clear gravel beside a dimple-board-covered wall",
    caption: "New weeping tile set on grade in clear gravel",
  },
  sealedWall: {
    src: img("sealed-wall-membrane-dimple.jpg"),
    alt: "Finished exterior system: black membrane, dimple board at the footing and clear gravel",
    caption: "The finished system before backfill",
  },
  finishedExterior: {
    src: img("finished-exterior.jpg"),
    alt: "Side of a house with fresh lawn after exterior waterproofing was completed",
    caption: "Finished exterior job — you'd never know we were there",
  },
  yard: {
    src: img("yard-restored.jpg"),
    alt: "Freshly laid sod along the side of a brick house after excavation",
    caption: "Yard cleaner than we found it",
  },
  weepingTile: {
    src: img("weeping-tile-level.jpg"),
    alt: "Technician checking the slope of new weeping tile with a level",
    caption: "Weeping tile done on grade, in gravel",
  },
  interiorMembrane: {
    src: img("interior-membrane-install.jpg"),
    alt: "Technician fastening dimpled drainage membrane to an interior basement wall",
    caption: "Interior drainage membrane install",
  },
  sump: {
    src: img("sump-pump-battery-backup.jpg"),
    alt: "New sump pump in a pit with a battery backup unit mounted on the wall",
    caption: "Primary pump with battery backup",
  },
  flooded: {
    src: img("flooded-basement-before-after.jpg"),
    alt: "Before and after: a flooded, debris-filled basement and the same basement dry and clean",
    caption: "Flooded basement — before and after",
  },
} satisfies Record<string, ServicePhoto>;

export const servicePages: Record<string, ServicePageContent> = {
  "exterior-waterproofing": {
    slug: "exterior-waterproofing",
    metaTitle: "Exterior Basement Waterproofing — From $275/ft | DryFort Waterproofing",
    metaDescription:
      "Exterior foundation waterproofing across Southern Ontario: excavation to the footing, rubberized membrane, dimple board and new weeping tile. From $275 per linear foot with a transferable 25-year warranty.",
    heroImage: photos.membrane.src,
    heroAlt: photos.membrane.alt,
    heroLead:
      "The permanent fix. We dig down to the footing, seal the wall from the outside and give water somewhere else to go — so it never reaches your foundation again.",
    intro: [
      "Most wet basements are an exterior problem: water sits against the foundation, finds a crack, a tie-hole or a cold joint, and comes through. Interior fixes manage that water after it's in the wall. Exterior waterproofing stops it before it ever touches the concrete, which is why it's the longest-lasting system we install and the only one we back with a transferable 25-year warranty.",
      "A full exterior system is excavation to the footing, a cleaned and repaired wall, a rubberized waterproof membrane, a dimpled drainage board over the membrane, and new weeping tile set in clear gravel at the footing. Then we backfill, compact, regrade and put your yard back together. Pricing starts at $275 per linear foot and depends on depth, access and what's on the ground along the wall — which is exactly what the instant photo estimate reads from your pictures.",
    ],
    processTitle: "How an exterior job goes",
    steps: [
      {
        title: "Excavate to the footing",
        text: "We dig along the affected wall right down to the bottom of the foundation, by machine where there's access and by hand where there isn't. Utilities are located first; obstructions like decks, AC units and interlock are planned around and noted in your quote.",
      },
      {
        title: "Clean and repair the wall",
        text: "The exposed wall is pressure-washed and inspected. Cracks are repaired, deteriorated parging is removed and the surface is made sound so the membrane bonds properly.",
      },
      {
        title: "Rubberized waterproof membrane",
        text: "A thick elastomeric rubberized membrane is applied over the entire wall from grade to the footing. This is the actual waterproof seal — it stays flexible through freeze-thaw and bridges hairline movement.",
      },
      {
        title: "Dimple drainage board",
        text: "Dimpled drainage board is fastened over the membrane. It protects the membrane from backfill and creates an air gap so any water that reaches the wall drops straight down to the weeping tile instead of pushing against the concrete.",
      },
      {
        title: "New weeping tile in clear gravel",
        text: "New perforated weeping tile is set on grade at the footing, wrapped in filter sock and bedded in clear gravel, and connected to your drainage or sump system so collected water is carried away.",
      },
      {
        title: "Backfill, regrade and restore",
        text: "We backfill in lifts and compact, regrade so surface water runs away from the house, and restore the yard — sod, garden beds, interlock or concrete — as itemized in your quote.",
      },
    ],
    gallery: [
      photos.membrane,
      photos.dimpleInstall,
      photos.drainage,
      photos.sealedWall,
      photos.finishedExterior,
      photos.yard,
    ],
    pricing: {
      figure: `From $${site.pricing.exteriorFrom}`,
      unit: "per linear foot",
      note: `$${site.pricing.exteriorMinJob.toLocaleString("en-CA")} minimum job. Excavation, membrane, drainage board and new weeping tile included. Final rate depends on depth, access and site conditions — confirmed at a free on-site visit.`,
    },
    faqs: [
      {
        q: "How long does exterior waterproofing take?",
        a: "Most residential jobs take a few working days from the first dig to a restored yard, depending on how many feet of wall, how deep the foundation is and whether the crew can get a machine in. Your written quote includes the schedule for your job.",
      },
      {
        q: "Will it destroy my yard?",
        a: "Excavation is disruptive for a few days, but restoration is part of the job. We backfill and compact in lifts, regrade so water drains away from the house, and put back sod, beds, interlock or concrete as itemized in the quote. Our crews take pride in leaving the yard cleaner than they found it.",
      },
      {
        q: "What does the 25-year warranty cover?",
        a: "The exterior system — membrane, drainage board and weeping tile along the waterproofed wall — against water penetration for 25 years, and it transfers to the next owner if you sell. It's in writing in your quote.",
      },
      {
        q: "Why is exterior more expensive than interior?",
        a: "Excavation. Digging to the footing, handling the soil and restoring the yard is most of the cost. What you get for it is a wall that water never reaches, instead of a system that manages water after it's already through.",
      },
    ],
  },

  "interior-waterproofing": {
    slug: "interior-waterproofing",
    metaTitle: "Interior Basement Waterproofing — From $120/ft | DryFort Waterproofing",
    metaDescription:
      "Interior basement waterproofing in Southern Ontario: internal weeping tile at the footing, dimpled drainage membrane and sump integration — no excavation. From $120 per linear foot.",
    heroImage: photos.interiorMembrane.src,
    heroAlt: photos.interiorMembrane.alt,
    heroLead:
      "When digging outside isn't practical, we capture the water at the wall from inside and move it safely to a sump — no excavation, less disruption.",
    intro: [
      "Not every house can be waterproofed from the outside. Shared walls, additions, decks, finished landscaping or lot lines too tight for any access all make excavation impractical or uneconomic. An interior drainage system is the right answer in those cases: instead of stopping water at the outside face of the wall, it collects whatever comes through at the footing and carries it to a sump pump before it can reach your floor.",
      "The system is an internal weeping tile set in a channel along the footing, a dimpled drainage membrane on the lower wall that directs seepage down into that channel, and a connection to a sump pit and pump. The floor is then re-poured. Interior work runs $120 per linear foot with a $2,800 minimum; sump pumps, battery backups and other add-ons are quoted as separate line items so you can see exactly what you're paying for.",
    ],
    processTitle: "How an interior job goes",
    steps: [
      {
        title: "Open the floor along the wall",
        text: "We cut and remove a strip of the basement slab along the leaking wall to expose the footing. Finished walls in that area are opened up as needed.",
      },
      {
        title: "Interior weeping tile at the footing",
        text: "Perforated weeping tile is set in clear gravel in the channel beside the footing, sloped toward the sump location so collected water flows by gravity.",
      },
      {
        title: "Dimpled drainage membrane",
        text: "Dimpled membrane is fastened to the lower wall and tucked into the drainage channel. Water that comes through the wall runs down behind the membrane and into the weeping tile — never onto your floor.",
      },
      {
        title: "Connect to the sump",
        text: "The weeping tile drains into a sump pit. If you don't have one, or yours is undersized, we install a new pit and pump — with a battery backup if you want protection during power outages.",
      },
      {
        title: "Re-pour the floor",
        text: "The channel is covered and the concrete floor re-poured flush, leaving a clean strip along the wall that can be finished over.",
      },
    ],
    gallery: [photos.interiorMembrane, photos.sump],
    pricing: {
      figure: `From $${site.pricing.interiorPerFoot}`,
      unit: "per linear foot",
      note: `$${site.pricing.interiorMinJob.toLocaleString("en-CA")} minimum job. Sump pump, battery backup and other add-ons quoted separately. Final price confirmed at a free on-site visit.`,
    },
    faqs: [
      {
        q: "Does interior waterproofing actually stop the leak?",
        a: "It stops water from reaching your floor, which is what matters for a dry, usable basement. It doesn't stop water from entering the wall itself — only an exterior system does that — which is why we recommend exterior whenever excavation is practical, and interior when it isn't.",
      },
      {
        q: "Do I need a sump pump with an interior system?",
        a: "Yes. The internal weeping tile collects water; the sump pump is what removes it from the house. If you already have a working, properly sized pit and pump we connect to it; if not, we quote a new one as a separate line item.",
      },
      {
        q: "How disruptive is it?",
        a: "Far less than excavation. The work is inside, along one or more walls, and there's no digging in the yard. Finished walls along the affected run are opened and the floor strip is re-poured; we keep dust and debris contained.",
      },
    ],
  },

  "emergency-flood-response": {
    slug: "emergency-flood-response",
    metaTitle: "24/7 Emergency Basement Flood Response | DryFort Waterproofing",
    metaDescription:
      "Basement flooding right now? DryFort answers 24/7 across Southern Ontario — a real person picks up, a crew is dispatched, water is extracted and the entry point found. Call (647) 370-3280.",
    heroImage: photos.flooded.src,
    heroAlt: photos.flooded.alt,
    heroLead:
      "Water coming in right now? Call the line and a real person answers — nights, weekends and holidays. Crews dispatch across Southern Ontario.",
    intro: [
      "Basements don't flood during business hours. When water is coming in at 2 AM in a storm, you need someone who picks up, understands what's happening and can get a crew moving. That's what the DryFort emergency line is: a live answer, 24 hours a day, 365 days a year, with dispatch across Toronto, the GTA and Southern Ontario.",
      "On site, the first job is to stop the damage getting worse: extract standing water, find where it's coming in, and stabilize the situation — a temporary seal, a pump, a diversion — so you can get through the night. Then we give you a straight assessment of what caused it and a written plan for the permanent repair. Emergency call-outs are quoted up front before any work starts.",
    ],
    processTitle: "What happens when you call",
    steps: [
      {
        title: "A real person answers",
        text: "No answering service, no voicemail. Tell us what you're seeing — where the water is, how fast it's coming in, whether it's near electrical — and we'll tell you what to do right now while a crew is on the way.",
      },
      {
        title: "Crew dispatched",
        text: "We dispatch the nearest available crew with pumps, extraction equipment and temporary sealing materials.",
      },
      {
        title: "Extract the water",
        text: "Standing water is pumped and extracted so the damage stops spreading into drywall, flooring and belongings.",
      },
      {
        title: "Find the entry point",
        text: "A flood has a source — a failed sump, a cracked wall, a blocked weeping tile, a backed-up sewer, a window well. We find it so the fix addresses the cause, not just the symptom.",
      },
      {
        title: "Stabilize",
        text: "Whatever it takes to get you safely to the permanent repair: a temporary crack seal, a replacement pump, redirected discharge, a backwater valve check.",
      },
      {
        title: "A plan for the permanent fix",
        text: "You get an honest explanation of what happened and a free, written, itemized quote for the permanent repair — exterior, interior, crack injection, sump or drainage — with no pressure to decide on the spot.",
      },
    ],
    gallery: [photos.flooded, photos.sump],
    faqs: [
      {
        q: "What should I do while I wait for the crew?",
        a: "If water is anywhere near outlets, panels or appliances, shut off power to the basement at the breaker — only if you can reach the panel without standing in water. Move what you can to higher ground, and don't wade through standing water near anything electrical. Our dispatcher will walk you through it on the call.",
      },
      {
        q: "Do you charge just for coming out?",
        a: "Emergency call-outs are quoted up front before any work starts, so you know the number before the crew lifts a hose. The permanent repair is quoted separately, in writing, after we've found the cause.",
      },
      {
        q: "Do you really work nights, weekends and holidays?",
        a: "Yes. The emergency line is answered 24/7, 365 days a year, and crews dispatch around the clock across Southern Ontario.",
      },
    ],
  },

  "sump-pump-installation": {
    slug: "sump-pump-installation",
    metaTitle: "Sump Pump Installation, Replacement & Battery Backup | DryFort Waterproofing",
    metaDescription:
      "Sump pump installation and replacement across Southern Ontario — new pits, primary pumps, battery backups and discharge lines, with help claiming municipal subsidies.",
    heroImage: images.pumpGravel,
    heroAlt: "Water pump and discharge pipe on gravel",
    heroLead:
      "Your basement's last line of defence. Properly sized, properly installed, and backed up so a power outage in a storm doesn't become a flood.",
    intro: [
      "Every drainage system — interior or exterior — ends at the sump. The weeping tile collects the water; the pump is what gets it out of the house. An undersized, aging or unmaintained pump is one of the most common causes of basement flooding we see, and it tends to fail exactly when it's working hardest: during a heavy storm, often one that also knocks out the power.",
      "We install new sump pits and primary pumps, replace worn units, route and freeze-protect discharge lines, and add battery backup systems that keep pumping when the power goes out. Many Ontario municipalities subsidize this work — Toronto's program covers up to $6,650 across eligible items — and we help you with the paperwork.",
    ],
    processTitle: "How a sump installation goes",
    steps: [
      {
        title: "Assess and size",
        text: "We look at how much water your drainage system collects, how high it has to be lifted and how far the discharge has to run, and size the pit and pump to match — not a one-size-fits-all unit off the shelf.",
      },
      {
        title: "Pit and primary pump",
        text: "A new pit is cut into the slab at the low point of the drainage system (or your existing pit is cleaned and inspected), and a primary pump is installed with a check valve and a sealed lid.",
      },
      {
        title: "Discharge line and freeze protection",
        text: "The discharge is routed outside to a point where water drains away from the foundation, with a freeze-protected outlet so an ice-blocked line can't back the pump up in February.",
      },
      {
        title: "Battery backup",
        text: "A battery backup pump sits alongside the primary and takes over automatically if the power fails or the primary can't keep up. We recommend it on every installation.",
      },
      {
        title: "Test, and subsidy paperwork",
        text: "The system is tested under load before we leave. If your municipality offers a subsidy, we provide the documentation you need to claim it.",
      },
    ],
    gallery: [photos.sump, photos.interiorMembrane],
    faqs: [
      {
        q: "Is a battery backup worth it?",
        a: "Yes, and it's the add-on we recommend most. The storms that fill your sump fastest are the same storms that knock out power. A backup pump runs for hours on battery and takes over the moment the primary stops.",
      },
      {
        q: "How often should a sump pump be replaced?",
        a: "Most pumps last roughly 7–10 years depending on how hard they work. If yours is older than that, runs constantly, cycles oddly, or you've never tested it, have it looked at before the spring melt.",
      },
      {
        q: "Can I get a subsidy for this?",
        a: "Many Southern Ontario municipalities run basement flooding protection programs that cover sump pumps, backwater valves and related work. Toronto's covers up to $6,650 across eligible items; others vary. We'll tell you what applies to your address and give you the paperwork.",
      },
    ],
  },

  "foundation-crack-repair": {
    slug: "foundation-crack-repair",
    metaTitle: "Foundation Crack Repair — Injection & Interior Repair | DryFort Waterproofing",
    metaDescription:
      "Leaking foundation crack? DryFort repairs poured-concrete and block foundation cracks across Southern Ontario — polyurethane/epoxy injection or interior chisel-out repair with crystalline waterproofing. Lifetime warranty on injections.",
    heroImage: images.crackWall,
    heroAlt: "Vertical crack running through a concrete foundation wall",
    heroLead:
      "A leaking crack doesn't fix itself, and every freeze-thaw cycle opens it a little more. We repair it permanently — from the inside, in most cases in a single visit.",
    intro: [
      "Poured concrete shrinks as it cures and moves as the ground around it heaves and settles, so cracks are common — and most are not structural. But any crack that reaches the outside of the wall is a path for water, and once water finds it, winter does the rest: it freezes, expands and widens the crack every year.",
      "We repair cracks from the inside so there's no digging. Depending on the crack, that's either a pressure injection of polyurethane or epoxy that fills the crack through its full depth, or the interior chisel-out method shown in the video below — the crack is opened into a channel, treated with crystalline waterproofing and rebuilt flush with waterproof repair mortar. Block foundations are handled with exterior-sealed repairs. Injections carry a lifetime warranty.",
    ],
    processTitle: "The 7-step interior crack repair",
    steps: [
      { title: "Locate the leak", text: "Inspect the inside of the foundation wall, find the exact crack where water is getting in, and mark out the repair area along its full length." },
      { title: "Cut along the repair area", text: "A grinder with a masonry blade cuts along both sides of the marked crack to create a controlled repair channel — the crack is opened up, not painted over." },
      { title: "Chisel out the concrete", text: "The concrete between the cuts is removed with a hammer and masonry chisel, opening the channel wider and deeper than the original crack so the repair bonds to sound concrete. All loose material and dust is removed." },
      { title: "Prepare the area", text: "The channel is cleaned thoroughly and prepared to the waterproofing product's requirements, including dampening the concrete where the product calls for it." },
      { title: "Apply crystalline waterproofing", text: "Cementitious crystalline waterproofing is applied directly to the prepared concrete inside the channel and worked thoroughly against the surface, so it bonds inside the concrete rather than sitting on top." },
      { title: "Rebuild and seal", text: "The channel is packed with compatible waterproof repair mortar or hydraulic repair material and compacted firmly, leaving no voids." },
      { title: "Finish", text: "The repair is smoothed flush with the surrounding wall and any final waterproofing coat the system calls for is applied." },
    ],
    gallery: [],
    showCrackRepairVideo: true,
    faqs: [
      {
        q: "Is a foundation crack serious?",
        a: "Most vertical and diagonal cracks in poured concrete are shrinkage or minor settlement and aren't structural — but they will leak. Horizontal cracks, stair-step cracks in block, or cracks that are widening or displaced can indicate a structural issue. Every crack repair includes a structural assessment so you know which you have.",
      },
      {
        q: "Injection or chisel-out — which will you use?",
        a: "It depends on the crack. Clean, narrow cracks in sound poured concrete are usually best injected, which fills the crack through its full depth. Wider, irregular or actively leaking cracks are often better opened up and rebuilt with the crystalline method. We'll tell you which we recommend and why before any work starts.",
      },
      {
        q: "How long does a crack repair take?",
        a: "Most single-crack interior repairs are done in one visit. No excavation is needed, so there's no disruption outside.",
      },
      {
        q: "What's the warranty?",
        a: "Crack injections carry a lifetime warranty against leaking through the repaired crack. Other repair methods are warrantied as stated in your written quote.",
      },
    ],
  },

  "drainage-systems": {
    slug: "drainage-systems",
    metaTitle: "Weeping Tile Replacement, Window Well & Drainage Systems | DryFort Waterproofing",
    metaDescription:
      "Weeping tile replacement, window well drains, backwater valves, grading and downspout management across Southern Ontario — the drainage that keeps water away from your foundation.",
    heroImage: photos.weepingTile.src,
    heroAlt: photos.weepingTile.alt,
    heroLead:
      "Most wet basements start with poor drainage. We fix the way water moves around your house — so it's carried away instead of pooling against the foundation.",
    intro: [
      "Before water gets into a basement, it has to get to the foundation and sit there. Collapsed or clogged weeping tile, a window well with no drain, downspouts dumping at the wall, grading that slopes toward the house, a sewer that backs up in a storm — these are the causes behind most of the leaks we're called to. Fix the drainage and many basements simply stop leaking.",
      "We replace failed weeping tile, install window well drains and covers, fit backwater valves to stop sewer backup, correct grading and manage downspout and sump discharge so water ends up well away from the house. Several of these items qualify for municipal subsidy programs, and we'll help you claim what applies.",
    ],
    processTitle: "How we fix drainage",
    steps: [
      {
        title: "Inspect and find the cause",
        text: "We look at how water reaches your foundation — roof runoff, grading, window wells, the condition of the existing weeping tile — and identify what's actually failing rather than guessing.",
      },
      {
        title: "Replace collapsed or clogged weeping tile",
        text: "Old clay or crushed tile is dug out and replaced with new perforated pipe in filter sock, set on grade in clear gravel so it drains freely for decades.",
      },
      {
        title: "Window well drains and covers",
        text: "Each well gets a drain tied into the weeping tile so it can't fill up and spill over the sill, plus a cover to keep leaves and debris out.",
      },
      {
        title: "Backwater valve",
        text: "A backwater valve on the sanitary line stops municipal sewer backup from coming up your floor drain during a storm — one of the most common and most expensive kinds of basement flooding.",
      },
      {
        title: "Grading and downspouts",
        text: "We regrade so the ground falls away from the house and extend or redirect downspouts and sump discharge so roof water never lands against the foundation.",
      },
    ],
    gallery: [photos.weepingTile, photos.drainage, photos.yard],
    faqs: [
      {
        q: "What is weeping tile and how do I know if mine has failed?",
        a: "Weeping tile is the perforated pipe at the base of your foundation that collects groundwater and carries it to a sump or storm connection. Signs it has failed: water at the wall-floor joint, a sump that never runs even in heavy rain, or a house old enough to have clay tile, which collapses and silts up over time.",
      },
      {
        q: "Will a backwater valve stop my basement flooding?",
        a: "If your flooding comes up through the floor drain during storms, yes — that's sewer backup and a backwater valve is the fix. If water comes through the walls or at the floor joint, the cause is groundwater and the answer is waterproofing or drainage. We tell you which it is.",
      },
      {
        q: "Are these subsidized?",
        a: "Often. Backwater valves, sump pumps and downspout disconnection are the items most municipalities subsidize; Toronto's program covers up to $6,650 across eligible items. We'll confirm what your city offers and give you the documentation.",
      },
    ],
  },
};

export function getServicePage(slug: string): ServicePageContent | undefined {
  return servicePages[slug];
}
