/**
 * DryFort rate sheet, as data — "GTA Waterproofing Mid-Market Rate Sheet 2026".
 *
 * This is the single source of truth for every number the pricing engine uses.
 * In production these values move into an owner-editable `rate_config` table in
 * Supabase so the owner can tune pricing without a code change; this object is
 * the seed / default for that table.
 *
 * Owner reviews and adjusts before go-live. Final pricing authority stays with
 * the owner (every AI estimate is owner-approved before the customer sees it).
 */

export const RATE_CONFIG = {
  currency: "CAD",

  // --- Exterior full-system waterproofing, per linear foot by depth ---
  exterior: {
    depthRates: {
      up_to_7: 275, // standard depth, up to 7 ft, clear machine access
      eight_ft: 340, // 8 ft depth (typical 1960s+ bungalow)
      nine_plus: 450, // 9 ft+ / deep or underpinned foundation
    },
    minimumJob: 4000,
  },

  // --- Interior drainage system, per linear foot ---
  interior: {
    perFoot: 120,
    minimumJob: 2800,
  },

  // --- Multipliers applied to the base per-foot waterproofing cost ---
  // access applies to exterior only; location + houseAge apply to both.
  access: {
    machine: 1.0,
    hand_dig: 1.25, // tight side yard under 3 ft / no machine access
  },
  location: {
    toronto_core: 1.1, // pre-1960 housing, tight lots
    toronto_suburbs: 1.05, // Scarborough / Etobicoke / North York
    belt_905: 1.0, // Mississauga, Vaughan, Markham, Richmond Hill
    outer_gta: 0.95, // Newmarket, Barrie corridor, Oshawa
  },
  houseAge: {
    pre_1950: 1.1, // rubble/block foundations, clay weeping tile, unknowns
    "1950_1980": 1.05,
    post_1980: 1.0,
  },

  // --- Flat exterior site-work items (part of the waterproofing bucket) ---
  siteWork: {
    concreteRemoveRepour: 1800,
    interlockRelay: 1400,
    asphaltCutPatch: 2200,
    landscapingRestore: 800,
  },
  gradingPerSide: 1200,

  // Obstruction at the wall (deck, AC unit, porch, gas meter reroute).
  // Rate sheet range is $500–$1,500; default used when the owner hasn't set one.
  obstruction: { min: 500, max: 1500, default: 1000 },

  // --- Independent add-on services (flat; no multipliers, no minimum) ---
  addOns: {
    crackInteriorFirst: 950,
    crackInteriorAdditional: 500,
    crackExterior: 2500,
    sumpNewPitPump: 2200,
    sumpPumpReplacement: 900,
    batteryBackup: 1300,
    backwaterValve: 3400,
    weepingTileDisconnect: 800,
    windowWellInstall: 1900,
    windowWellCover: 250,
    downspout: 350,
    cameraInspection: 450, // credited if the job is booked
    emergencyPremium: 500,
  },

  // Instant quote is shown as a range around the calculated number until
  // it's verified on site.
  quoteRange: { lowPct: -0.05, highPct: 0.15 },
  quoteValidDays: 30,

  /**
   * Municipal flood-prevention rebates. These apply ONLY to eligible items
   * (backwater valve, sump pump, battery backup) — NOT to membrane
   * waterproofing. The engine estimates against the eligible items in the
   * specific quote; it never subtracts a flat program amount from the total.
   *
   * NOTE: rebate amounts and rules change. Verify current figures with each
   * city before go-live. Only Toronto's per-item caps are published in the
   * rate sheet; Mississauga/Markham use the program cap until confirmed.
   */
  rebates: {
    toronto: {
      programCap: 6650,
      perItemCap: {
        backwaterValve: 1600,
        sumpPump: 2250,
        batteryBackup: 300,
      },
      assessmentCredit: 500, // added when any eligible work is present
      note: "City of Toronto Basement Flooding Protection Subsidy — estimate only, subject to city approval and application.",
    },
    mississauga: {
      programCap: 7500,
      perItemCap: null,
      assessmentCredit: 0,
      note: "City of Mississauga flood-prevention grant — estimate only, subject to city approval. Per-item caps to be verified before go-live.",
    },
    markham: {
      programCap: 5000,
      perItemCap: null,
      assessmentCredit: 0,
      note: "City of Markham flood rebate — pre-approval required before work starts; estimate only, subject to city approval.",
    },
  },
} as const;

export type RateConfig = typeof RATE_CONFIG;
