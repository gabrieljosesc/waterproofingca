import type {
  AccessType,
  DepthBucket,
  EstimateInput,
  HouseAgeBand,
  LocationTier,
  ObstructionInput,
  RebateCity,
  Service,
  SiteWorkType,
} from "@/lib/pricing";
import type { Database } from "@/lib/supabase/types";
import type { SiteConditions } from "@/lib/ai/vision";

type SubmissionRow = Database["public"]["Tables"]["estimate_submissions"]["Row"];

const SURFACE_TO_SITEWORK: Partial<
  Record<SiteConditions["ground_surfaces"][number], SiteWorkType>
> = {
  concrete: "concreteRemoveRepour",
  interlock: "interlockRelay",
  asphalt: "asphaltCutPatch",
};

export interface MappedEstimate {
  input: EstimateInput;
  /** Assumptions the owner should confirm (missing depth, defaulted footage…). */
  warnings: string[];
}

const DEFAULT_LINEAR_FEET = 30;

/**
 * Combine the customer's intake answers with what the AI read from the photos
 * to produce a pricing-engine input. Every place we fall back to a default is
 * recorded as a warning so the owner can correct it before sending a price.
 * Depth in particular can never come from a photo — it's the intake question.
 */
export function conditionsToInput(
  submission: SubmissionRow,
  conditions: SiteConditions
): MappedEstimate {
  const warnings: string[] = [];

  // Service — customer's stated intent; default exterior when unsure.
  let service: Service;
  if (submission.service_requested === "interior") {
    service = "interior";
  } else {
    service = "exterior";
    if (submission.service_requested !== "exterior") {
      warnings.push(
        "Service not specified by customer — defaulted to exterior. Confirm exterior vs interior."
      );
    }
  }

  // Linear feet — customer estimate; default if missing.
  let linearFeet = submission.linear_feet ?? 0;
  if (!linearFeet || linearFeet <= 0) {
    linearFeet = DEFAULT_LINEAR_FEET;
    warnings.push(
      `Wall length not provided — assumed ${DEFAULT_LINEAR_FEET} ft. Measure on site.`
    );
  }

  // Depth — intake only; a photo can't show it. Biggest price driver.
  let depth: DepthBucket = "up_to_7";
  if (
    submission.basement_depth_band === "up_to_7" ||
    submission.basement_depth_band === "eight_ft" ||
    submission.basement_depth_band === "nine_plus"
  ) {
    depth = submission.basement_depth_band;
  } else {
    warnings.push(
      "Basement depth unknown — assumed up to 7 ft (the cheapest tier). Confirm depth; it's the biggest price driver."
    );
  }

  // Access — from the AI.
  let access: AccessType = "machine";
  if (conditions.access === "hand_dig" || conditions.access === "machine") {
    access = conditions.access;
    if (conditions.access_confidence < 60) {
      warnings.push(
        `AI is only ${conditions.access_confidence}% confident on access (${conditions.access}). Verify.`
      );
    }
  } else {
    warnings.push("AI couldn't determine machine access from the photos — assumed machine.");
  }

  // Location tier — derived from city at intake.
  const location: LocationTier = (submission.location_tier as LocationTier) ?? "belt_905";
  if (!submission.location_tier) {
    warnings.push("Location tier not resolved from city — assumed 905 belt (×1.0).");
  }

  // House age — from year built.
  const houseAge: HouseAgeBand =
    (submission.house_age_band as HouseAgeBand) ?? "post_1980";
  if (!submission.house_age_band) {
    warnings.push("House age unknown — assumed post-1980 (no age surcharge).");
  }

  const input: EstimateInput = {
    service,
    linearFeet,
    depth,
    access,
    location,
    houseAge,
    rebateCity: (submission.rebate_city as RebateCity) ?? undefined,
  };

  // Exterior-only site work + obstructions from the photos.
  if (service === "exterior") {
    const siteWork = Array.from(
      new Set(
        conditions.ground_surfaces
          .map((s) => SURFACE_TO_SITEWORK[s])
          .filter((s): s is SiteWorkType => Boolean(s))
      )
    );
    if (siteWork.length) input.siteWork = siteWork;

    const obstructions: ObstructionInput[] = conditions.obstructions
      .filter((o) => o.near_wall)
      .map((o) => ({ label: o.label }));
    if (obstructions.length) input.obstructions = obstructions;
  }

  if (conditions.visible_cracks) {
    warnings.push(
      `AI saw ${conditions.crack_count || "some"} crack(s). Exterior pricing includes crack repair; for interior, add crack injection if needed.`
    );
  }
  if (conditions.photo_quality === "poor") {
    warnings.push("Photo quality is poor — treat this estimate as low-confidence.");
  }
  if (conditions.overall_confidence < 50) {
    warnings.push(
      `Overall AI confidence is low (${conditions.overall_confidence}%). Recommend a site visit before sending a price.`
    );
  }

  return { input, warnings };
}
