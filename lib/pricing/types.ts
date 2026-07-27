/**
 * Pricing engine types for the DryFort AI quote tool.
 *
 * The engine is deterministic: given a set of site conditions (read from the
 * customer's photos by the AI, plus their answers), it applies the owner's
 * rate sheet and returns an itemized breakdown and a quote range. It never
 * "knows" prices on its own — every number comes from `rateConfig.ts`.
 *
 * This is the liability surface of the whole product, so it is kept pure,
 * side-effect free, and fully unit-tested.
 */

export type Service = "exterior" | "interior";

/** Excavation depth bucket — the single biggest driver of exterior price. */
export type DepthBucket = "up_to_7" | "eight_ft" | "nine_plus";

/** Machine access vs. hand digging (tight side yard / no machine access). */
export type AccessType = "machine" | "hand_dig";

export type LocationTier =
  | "toronto_core"
  | "toronto_suburbs"
  | "belt_905"
  | "outer_gta";

export type HouseAgeBand = "pre_1950" | "1950_1980" | "post_1980";

export type RebateCity = "toronto" | "mississauga" | "markham";

/** Flat exterior site-work items that are part of the waterproofing job. */
export type SiteWorkType =
  | "concreteRemoveRepour"
  | "interlockRelay"
  | "asphaltCutPatch"
  | "landscapingRestore";

export interface ObstructionInput {
  /** Human label, e.g. "AC unit", "deck footing", "gas meter reroute". */
  label: string;
  /** Optional owner override; defaults to the config obstruction default. */
  cost?: number;
}

export interface CrackRepairInput {
  interiorCracks?: number;
  exteriorCracks?: number;
}

export interface SumpInput {
  newPitPump?: boolean;
  pumpReplacement?: boolean;
  batteryBackup?: boolean;
}

export interface WindowWellInput {
  installs?: number;
  covers?: number;
}

export interface EstimateInput {
  service: Service;
  /** Length of foundation wall being waterproofed. 0 for add-on-only jobs. */
  linearFeet: number;

  /** Required for exterior; ignored for interior. */
  depth?: DepthBucket;
  /** Exterior only. Defaults to "machine". */
  access?: AccessType;

  location: LocationTier;
  houseAge: HouseAgeBand;

  // --- Exterior site work (part of the waterproofing bucket) ---
  siteWork?: SiteWorkType[];
  gradingSides?: number;
  obstructions?: ObstructionInput[];

  // --- Independent add-on services (flat, added on top) ---
  crackRepair?: CrackRepairInput;
  sump?: SumpInput;
  backwaterValve?: boolean;
  weepingTileDisconnect?: boolean;
  windowWells?: WindowWellInput;
  downspouts?: number;
  cameraInspection?: boolean;
  emergency?: boolean;

  /** City whose rebate program to estimate against, if any. */
  rebateCity?: RebateCity;
}

export interface LineItem {
  label: string;
  amount: number;
  /** True if this item counts toward a municipal flood-prevention rebate. */
  rebateEligible?: boolean;
  note?: string;
}

export interface RebateEligibleItem {
  label: string;
  /** The item's cost in this quote. */
  amount: number;
  /** The rebate this item contributes, after per-item caps. */
  rebate: number;
}

export interface RebateResult {
  city: RebateCity | null;
  eligible: RebateEligibleItem[];
  estimatedRebate: number;
  note: string | null;
}

export interface EstimateResult {
  service: Service;
  currency: string;

  lineItems: LineItem[];

  /** Effective per-foot rate after all multipliers (null for add-on-only). */
  effectivePerFoot: number | null;
  modifiers: { access: number; location: number; houseAge: number };

  /** Waterproofing bucket total after the minimum-job floor. */
  waterproofingSubtotal: number;
  minimumApplied: boolean;

  /** Independent add-ons total. */
  addOnsSubtotal: number;

  /** Point estimate before the display range is applied. */
  calculatedTotal: number;

  /** Quote range shown to the customer (calculatedTotal −5% / +15%). */
  rangeLow: number;
  rangeHigh: number;

  rebate: RebateResult;
  /** Range after subtracting the estimated rebate (never below 0). */
  netAfterRebateLow: number;
  netAfterRebateHigh: number;

  quoteValidDays: number;

  notes: string[];
  warnings: string[];
}
