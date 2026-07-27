/**
 * DryFort pricing engine.
 *
 * calculateEstimate() turns a set of site conditions + the owner's rate sheet
 * into an itemized breakdown, a display range, and a rebate estimate.
 *
 * Model (documented so the numbers are defensible):
 *
 *   effective per-foot = depthRate × access × location × houseAge
 *   base               = effective per-foot × linear feet
 *   waterproofing      = base + site work + obstructions,
 *                        floored at the service minimum (only if feet > 0)
 *   add-ons            = flat services (sump, backwater, cracks, wells, …),
 *                        NOT multiplied and NOT floored
 *   total              = waterproofing + add-ons
 *   range              = total −5% … +15%
 *   rebate             = capped, per eligible item, per city — membrane work
 *                        is never rebate-eligible
 *   net                = range − rebate (never below 0)
 *
 * Assumptions worth knowing:
 *  - Location and house-age factors apply to the per-foot waterproofing work,
 *    not to flat add-ons (a sump pump costs the same across the GTA).
 *  - The access (hand-dig) multiplier applies to exterior work only.
 *  - The service minimum floors the waterproofing bucket only; an add-on-only
 *    job (e.g. a lone sump replacement) is not forced up to the minimum.
 */

import { RATE_CONFIG } from "./rateConfig";
import type {
  EstimateInput,
  EstimateResult,
  LineItem,
  RebateCity,
  RebateEligibleItem,
  RebateResult,
} from "./types";

const round = (n: number) => Math.round(n);

export class PricingInputError extends Error {}

/**
 * Calculate an estimate. Throws {@link PricingInputError} on hard-invalid input
 * (negative feet, missing exterior depth); soft issues surface in `warnings`.
 */
export function calculateEstimate(
  input: EstimateInput,
  config = RATE_CONFIG
): EstimateResult {
  const warnings: string[] = [];
  const notes: string[] = [];

  if (!Number.isFinite(input.linearFeet) || input.linearFeet < 0) {
    throw new PricingInputError("linearFeet must be a non-negative number.");
  }
  if (input.service === "exterior" && input.linearFeet > 0 && !input.depth) {
    throw new PricingInputError(
      "Exterior waterproofing requires an excavation depth."
    );
  }

  const lineItems: LineItem[] = [];

  // --- Multipliers ---
  const access = input.access ?? "machine";
  const accessMult =
    input.service === "exterior" ? config.access[access] : 1;
  const locationMult = config.location[input.location];
  const houseAgeMult = config.houseAge[input.houseAge];
  const modifiers = {
    access: accessMult,
    location: locationMult,
    houseAge: houseAgeMult,
  };

  // --- Base waterproofing (per linear foot) ---
  let effectivePerFoot: number | null = null;
  let base = 0;

  if (input.linearFeet > 0) {
    const baseRate =
      input.service === "exterior"
        ? config.exterior.depthRates[input.depth ?? "up_to_7"]
        : config.interior.perFoot;

    effectivePerFoot = baseRate * accessMult * locationMult * houseAgeMult;
    base = round(effectivePerFoot * input.linearFeet);

    const depthLabel =
      input.service === "exterior" ? ` (${input.depth} depth)` : "";
    lineItems.push({
      label: `${
        input.service === "exterior" ? "Exterior" : "Interior"
      } waterproofing, ${input.linearFeet} linear ft${depthLabel}`,
      amount: base,
      note: `${effectivePerFoot.toFixed(2)}/ft effective (base $${
        baseRate
      }/ft × access ${accessMult} × location ${locationMult} × age ${houseAgeMult})`,
    });
  }

  // --- Exterior site work (part of the waterproofing bucket) ---
  let siteWorkTotal = 0;

  if (input.service === "exterior") {
    for (const item of input.siteWork ?? []) {
      const amount = config.siteWork[item];
      siteWorkTotal += amount;
      lineItems.push({ label: siteWorkLabel(item), amount });
    }

    if (input.gradingSides && input.gradingSides > 0) {
      const amount = config.gradingPerSide * input.gradingSides;
      siteWorkTotal += amount;
      lineItems.push({
        label: `Grading correction (${input.gradingSides} side${
          input.gradingSides > 1 ? "s" : ""
        })`,
        amount,
      });
    }

    for (const obs of input.obstructions ?? []) {
      const amount = clampObstruction(obs.cost, config);
      siteWorkTotal += amount;
      lineItems.push({ label: `Obstruction: ${obs.label}`, amount });
    }
  } else if (
    input.siteWork?.length ||
    input.gradingSides ||
    input.obstructions?.length
  ) {
    warnings.push(
      "Site-work / obstruction items are only priced for exterior jobs and were ignored."
    );
  }

  // --- Waterproofing bucket + minimum-job floor ---
  const waterproofingRaw = base + siteWorkTotal;
  const minimumJob =
    input.service === "exterior"
      ? config.exterior.minimumJob
      : config.interior.minimumJob;

  let waterproofingSubtotal = waterproofingRaw;
  let minimumApplied = false;
  if (input.linearFeet > 0 && waterproofingRaw < minimumJob) {
    waterproofingSubtotal = minimumJob;
    minimumApplied = true;
    notes.push(
      `Minimum job charge of $${minimumJob.toLocaleString(
        "en-CA"
      )} applied.`
    );
  }

  // --- Independent add-on services ---
  const addOns: LineItem[] = [];
  const a = config.addOns;

  const cracks = input.crackRepair;
  if (cracks?.interiorCracks && cracks.interiorCracks > 0) {
    addOns.push({ label: "Crack injection — first crack", amount: a.crackInteriorFirst });
    const extra = cracks.interiorCracks - 1;
    if (extra > 0) {
      addOns.push({
        label: `Crack injection — ${extra} additional`,
        amount: a.crackInteriorAdditional * extra,
      });
    }
  }
  if (cracks?.exteriorCracks && cracks.exteriorCracks > 0) {
    addOns.push({
      label: `Exterior crack repair × ${cracks.exteriorCracks}`,
      amount: a.crackExterior * cracks.exteriorCracks,
    });
  }

  if (input.sump?.newPitPump) {
    addOns.push({ label: "New sump pit + pump", amount: a.sumpNewPitPump, rebateEligible: true });
  }
  if (input.sump?.pumpReplacement) {
    addOns.push({ label: "Sump pump replacement", amount: a.sumpPumpReplacement, rebateEligible: true });
  }
  if (input.sump?.batteryBackup) {
    addOns.push({ label: "Battery backup system", amount: a.batteryBackup, rebateEligible: true });
  }
  if (input.backwaterValve) {
    addOns.push({ label: "Backwater valve install", amount: a.backwaterValve, rebateEligible: true });
  }
  if (input.weepingTileDisconnect) {
    addOns.push({ label: "Weeping tile disconnect from sanitary", amount: a.weepingTileDisconnect });
  }
  if (input.windowWells?.installs && input.windowWells.installs > 0) {
    addOns.push({
      label: `Window well install × ${input.windowWells.installs}`,
      amount: a.windowWellInstall * input.windowWells.installs,
    });
  }
  if (input.windowWells?.covers && input.windowWells.covers > 0) {
    addOns.push({
      label: `Window well cover × ${input.windowWells.covers}`,
      amount: a.windowWellCover * input.windowWells.covers,
    });
  }
  if (input.downspouts && input.downspouts > 0) {
    addOns.push({
      label: `Downspout disconnect + extension × ${input.downspouts}`,
      amount: a.downspout * input.downspouts,
    });
  }
  if (input.cameraInspection) {
    addOns.push({
      label: "Camera inspection of drains",
      amount: a.cameraInspection,
      note: "Credited back if the job is booked.",
    });
  }
  if (input.emergency) {
    addOns.push({ label: "Emergency / priority scheduling", amount: a.emergencyPremium });
  }

  const addOnsSubtotal = addOns.reduce((sum, i) => sum + i.amount, 0);
  lineItems.push(...addOns);

  // --- Totals + display range ---
  const calculatedTotal = waterproofingSubtotal + addOnsSubtotal;
  const rangeLow = round(calculatedTotal * (1 + config.quoteRange.lowPct));
  const rangeHigh = round(calculatedTotal * (1 + config.quoteRange.highPct));

  // --- Rebate ---
  const rebate = estimateRebate(input.rebateCity, addOns, config);
  const netAfterRebateLow = Math.max(0, rangeLow - rebate.estimatedRebate);
  const netAfterRebateHigh = Math.max(0, rangeHigh - rebate.estimatedRebate);

  if (rebate.city) {
    notes.push(
      "Rebate is estimated against eligible items only (backwater valve, sump pump, battery backup) — not waterproofing membrane work."
    );
  }
  notes.push(
    "Range is a preliminary estimate; final price is confirmed on site."
  );

  return {
    service: input.service,
    currency: config.currency,
    lineItems,
    effectivePerFoot,
    modifiers,
    waterproofingSubtotal,
    minimumApplied,
    addOnsSubtotal,
    calculatedTotal,
    rangeLow,
    rangeHigh,
    rebate,
    netAfterRebateLow,
    netAfterRebateHigh,
    quoteValidDays: config.quoteValidDays,
    notes,
    warnings,
  };
}

function clampObstruction(cost: number | undefined, config = RATE_CONFIG): number {
  const o = config.obstruction;
  if (cost === undefined) return o.default;
  return Math.min(Math.max(cost, o.min), o.max);
}

function siteWorkLabel(item: keyof typeof RATE_CONFIG.siteWork): string {
  switch (item) {
    case "concreteRemoveRepour":
      return "Concrete walkway/patio removal & re-pour";
    case "interlockRelay":
      return "Interlock removal & re-lay";
    case "asphaltCutPatch":
      return "Asphalt driveway cut & patch";
    case "landscapingRestore":
      return "Landscaping restoration (sod, beds)";
  }
}

/**
 * Estimate a municipal rebate against the eligible add-ons only, applying
 * per-item caps (where published) and the program cap. Never applied to
 * membrane waterproofing.
 */
function estimateRebate(
  city: RebateCity | undefined,
  addOns: LineItem[],
  config = RATE_CONFIG
): RebateResult {
  if (!city) {
    return { city: null, eligible: [], estimatedRebate: 0, note: null };
  }

  const program = config.rebates[city];
  const perItem = program.perItemCap;
  const eligible: RebateEligibleItem[] = [];

  for (const item of addOns) {
    if (!item.rebateEligible) continue;
    let cap = Infinity;
    if (perItem) {
      if (item.label.startsWith("Backwater")) cap = perItem.backwaterValve;
      else if (item.label.startsWith("Battery")) cap = perItem.batteryBackup;
      else if (item.label.startsWith("New sump") || item.label.startsWith("Sump pump"))
        cap = perItem.sumpPump;
    }
    eligible.push({
      label: item.label,
      amount: item.amount,
      rebate: Math.min(item.amount, cap),
    });
  }

  let total = eligible.reduce((sum, i) => sum + i.rebate, 0);
  if (total > 0) total += program.assessmentCredit;
  total = Math.min(total, program.programCap);

  return {
    city,
    eligible,
    estimatedRebate: total,
    note: eligible.length ? program.note : null,
  };
}
