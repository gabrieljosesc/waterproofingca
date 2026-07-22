/**
 * Central content/config for the DryFort Waterproofing marketing site.
 * Contact details below are MOCK placeholders for the UI demo — swap them
 * out for the client's real phone / email / address before going live.
 */

export const site = {
  name: "DryFort Waterproofing",
  shortName: "DryFort",
  tagline: "24/7 Emergency Basement Waterproofing",
  description:
    "DryFort Waterproofing is Southern Ontario's 24/7 emergency basement waterproofing company — exterior & interior foundation waterproofing, sump pumps, crack repair and flood response for homes and commercial buildings. Transparent pricing from $400 per linear foot.",
  url: "https://www.dryfortwaterproofing.ca",

  // --- CONTACT DETAILS (mock placeholders — replace before launch) ---
  phone: "(905) 555-0134",
  phoneHref: "tel:+19055550134",
  email: "info@dryfortwaterproofing.ca",
  emailHref: "mailto:info@dryfortwaterproofing.ca",
  address: "45 Lakeshore Rd E, Unit 2, Mississauga, ON",
  hours: "Office: Mon–Fri 8:00 AM – 6:00 PM · Emergency crews: 24/7",

  pricePerLinearFoot: 400,

  // --- FINANCING ---
  // PLACEHOLDER terms for the demo UI. Confirm the real lender, rate, terms
  // and legal disclosure with the client before launch. `exampleTermMonths`
  // is only used to show an illustrative "as low as $X/month" figure.
  financing: {
    minMonthly: 0, // $0 down messaging
    exampleTermMonths: 120, // representative equal-payment plan length
    maxTermMonths: 120,
  },

  serviceArea:
    "Southern Ontario — Toronto & the GTA, Mississauga, Hamilton, Burlington, Oakville, St. Catharines & Niagara, Kitchener–Waterloo, Guelph, Brantford, London and surrounding communities.",
  serviceCities: [
    "Toronto",
    "Mississauga",
    "Hamilton",
    "Burlington",
    "Oakville",
    "St. Catharines",
    "Niagara Falls",
    "Kitchener",
    "Waterloo",
    "Guelph",
    "Brantford",
    "London",
  ],
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Waterproofing imagery (Unsplash — free to use, all subject-verified). */
export const images = {
  /** Crew pouring/levelling concrete along a building foundation with gravel. */
  heroWork:
    "https://images.unsplash.com/photo-1685464197644-41d9b07e1e73?auto=format&fit=crop&w=1920&h=1080&q=80",
  /** Worker laying concrete blocks against a foundation wall. */
  foundationWork:
    "https://images.unsplash.com/photo-1673865641469-34498379d8af?auto=format&fit=crop&w=1600&q=80",
  /** Excavator digging a trench. */
  excavatorTrench:
    "https://images.unsplash.com/photo-1759579478942-a6992a87fb8f?auto=format&fit=crop&w=1200&q=80",
  /** Heavy excavation equipment on open ground. */
  excavator:
    "https://images.unsplash.com/photo-1610079732357-0d20c1a98ceb?auto=format&fit=crop&w=1200&q=80",
  /** Unfinished basement with exposed joists and support poles. */
  basementUnfinished:
    "https://images.unsplash.com/photo-1782353921981-bb73a53a7482?auto=format&fit=crop&w=1200&q=80",
  /** Dark, damp block-wall basement — the "before" every homeowner fears. */
  basementDark:
    "https://images.unsplash.com/photo-1632192723921-fe6feb9c905d?auto=format&fit=crop&w=1200&q=80",
  /** Industrial water pump and discharge pipe on gravel. */
  pumpGravel:
    "https://images.unsplash.com/photo-1682268294146-13a263ae7224?auto=format&fit=crop&w=1200&q=80",
  /** Long vertical crack running through a concrete wall. */
  crackWall:
    "https://images.unsplash.com/photo-1546816077-623b4eaab352?auto=format&fit=crop&w=1200&q=80",
  /** Drainage pipe laid in an open soil trench. */
  pipeTrench:
    "https://images.unsplash.com/photo-1591638436281-078219f200af?auto=format&fit=crop&w=1200&q=80",
  /** Concrete foundation blocks on excavated soil. */
  foundationBlocks:
    "https://images.unsplash.com/photo-1591638436214-1efb2036e616?auto=format&fit=crop&w=1200&q=80",
  /** Rain drops streaking down a dark window. */
  rainDark:
    "https://images.unsplash.com/photo-1501691223387-dd0500403074?auto=format&fit=crop&w=1600&q=80",
  houseClassic:
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
  houseModern:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  commercial:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
} as const;

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  image: string;
};

export const services: Service[] = [
  {
    slug: "exterior-waterproofing",
    title: "Exterior Foundation Waterproofing",
    short:
      "Excavate, seal and shield the outside of your foundation — the permanent fix for leaky basements.",
    description:
      "Exterior waterproofing stops water before it ever touches your foundation. We excavate down to the footing, repair cracks, apply a rubberized waterproof membrane and drainage board, and install new weeping tile with clear gravel. It's the most complete, longest-lasting protection available — and our standard, transparent rate is $400 per linear foot.",
    features: [
      "Full excavation to the footing",
      "Rubberized membrane & drainage board",
      "New weeping tile & clear gravel backfill",
      "Foundation crack repair included",
      "Transferable 25-year warranty",
    ],
    image: images.excavatorTrench,
  },
  {
    slug: "interior-waterproofing",
    title: "Interior Basement Waterproofing",
    short:
      "Internal drainage systems that capture water at the wall and move it safely to a sump.",
    description:
      "When exterior access isn't practical — tight lot lines, additions, finished landscaping — an interior system is the smart alternative. We install an internal weeping tile and drainage membrane along the footing that collects water penetrating the wall and channels it to a sump pump, keeping your basement dry year-round.",
    features: [
      "Interior weeping tile at the footing",
      "Dimpled drainage membrane on walls",
      "Sump pit & pump integration",
      "Minimal disruption to landscaping",
      "Ideal for finished neighbourhood lots",
    ],
    image: images.basementUnfinished,
  },
  {
    slug: "emergency-flood-response",
    title: "24/7 Emergency Flood Response",
    short:
      "Basement flooding right now? Our emergency crews answer around the clock, every day of the year.",
    description:
      "Water doesn't wait for business hours, and neither do we. DryFort runs true 24/7 emergency response across Southern Ontario — nights, weekends and holidays. We extract standing water, find the point of entry, stabilize the situation, and give you a clear, honest plan for the permanent fix.",
    features: [
      "Live answer 24 hours a day, 365 days a year",
      "Rapid dispatch across Southern Ontario",
      "Water extraction & source identification",
      "Temporary stabilization on the spot",
      "Straight-talk plan for the permanent repair",
    ],
    image: images.basementDark,
  },
  {
    slug: "sump-pump-installation",
    title: "Sump Pump Installation & Repair",
    short:
      "Primary pumps, battery backups and full replacements — the heart of a dry basement.",
    description:
      "A properly sized, properly installed sump pump is your basement's last line of defence. We install new sump pits and pumps, replace aging units, and add battery backup systems so a power outage during a storm doesn't become a flooded basement. Many municipalities offer subsidy programs — we'll help you navigate them.",
    features: [
      "New sump pit & pump installation",
      "Battery backup systems",
      "Pump replacement & servicing",
      "Discharge line routing & freeze protection",
      "Municipal subsidy guidance",
    ],
    image: images.pumpGravel,
  },
  {
    slug: "foundation-crack-repair",
    title: "Foundation Crack Repair",
    short:
      "Injection and structural repair for cracked poured-concrete and block foundations.",
    description:
      "Foundation cracks let water in and only get worse with freeze-thaw cycles. We repair them permanently — polyurethane or epoxy injection for poured walls, and exterior-sealed repairs for block foundations — stopping leaks and protecting the structural integrity of your home.",
    features: [
      "Polyurethane & epoxy crack injection",
      "Poured concrete & block foundations",
      "Interior & exterior repair options",
      "Structural assessment included",
      "Lifetime warranty on injections",
    ],
    image: images.crackWall,
  },
  {
    slug: "drainage-systems",
    title: "Weeping Tile & Drainage Systems",
    short:
      "Window well, weeping tile and surface drainage that moves water away from your foundation.",
    description:
      "Most wet basements start with poor drainage. We replace collapsed or clogged weeping tile, install window well drains, correct grading, and connect everything so water is carried away from your foundation instead of pooling against it.",
    features: [
      "Weeping tile replacement & repair",
      "Window well drains & covers",
      "Backwater valve installation",
      "Grading & surface drainage correction",
      "Downspout & discharge management",
    ],
    image: images.pipeTrench,
  },
];

export type Testimonial = {
  name: string;
  location: string;
  service: string;
  text: string;
};

/**
 * SAMPLE testimonials for the demo UI — replace with the client's real
 * customer reviews (ideally synced from Google Reviews) before launch.
 */
export const testimonials: Testimonial[] = [
  {
    name: "Mark & Josie T.",
    location: "Hamilton",
    service: "Exterior Waterproofing",
    text: "Our basement flooded twice in one spring. DryFort quoted exactly what the website said — $400 a foot, no games — and the crew left the yard cleaner than they found it. Two storm seasons later, bone dry.",
  },
  {
    name: "Priya S.",
    location: "Mississauga",
    service: "24/7 Emergency Response",
    text: "Called at 2 AM with water pouring in. A real person answered, a crew was here before sunrise, and they walked us through the permanent fix without any pressure. Can't recommend them enough.",
  },
  {
    name: "D. Kowalski",
    location: "St. Catharines",
    service: "Sump Pump + Battery Backup",
    text: "They installed our sump pump and battery backup and helped us claim the municipal subsidy. Straight answers, tidy work, fair price. The power went out in a storm last month — the backup did its job.",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "How much does basement waterproofing cost in Southern Ontario?",
    a: "DryFort charges a transparent flat rate of $400 per linear foot for full exterior foundation waterproofing — excavation, membrane, drainage board and new weeping tile included. Interior systems, crack injections and sump pump work are quoted per project. Every quote is free, written and itemized, for both residential and commercial properties.",
  },
  {
    q: "Do you really offer 24/7 emergency waterproofing service?",
    a: "Yes. DryFort runs true 24/7 emergency flood response across Southern Ontario — nights, weekends and holidays. Call our emergency line and a crew is dispatched to extract water, find the entry point and stabilize your basement, followed by a clear plan for the permanent fix.",
  },
  {
    q: "What areas does DryFort Waterproofing serve?",
    a: "We serve all of Southern Ontario, including Toronto and the GTA, Mississauga, Hamilton, Burlington, Oakville, St. Catharines, Niagara, Kitchener–Waterloo, Guelph, Brantford, London and the surrounding communities.",
  },
  {
    q: "Should I choose exterior or interior waterproofing?",
    a: "Exterior waterproofing is the most complete, permanent solution because it stops water before it reaches your foundation. Interior systems are the right choice when excavation isn't practical — tight lot lines, additions or finished landscaping. We assess your property for free and recommend whichever actually fits your situation, not the biggest ticket.",
  },
  {
    q: "Is your work guaranteed?",
    a: "Yes — exterior waterproofing carries a transferable 25-year warranty and crack injections carry a lifetime warranty. DryFort is fully licensed and insured for residential and commercial work.",
  },
  {
    q: "Do you handle commercial waterproofing?",
    a: "Yes. We waterproof commercial and industrial foundations, parking garages, and multi-unit residential buildings, with scheduling built around your operations and volume pricing on larger runs.",
  },
];
