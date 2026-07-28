/**
 * Intake payload shape + validation for the customer estimate wizard.
 * Hand-rolled (no schema library) to keep dependencies minimal.
 */

import type { Database } from "@/lib/supabase/types";
import {
  houseAgeBandFromYear,
  locationTierFromCity,
  rebateCityFromCity,
  serviceAreaOk,
} from "./mapping";

type SubmissionInsert = Database["public"]["Tables"]["estimate_submissions"]["Insert"];

export interface IntakePayload {
  // contact
  fullName?: string;
  email?: string;
  phone?: string;
  preferredContact?: string;
  // property
  address?: string;
  city?: string;
  postalCode?: string;
  propertyType?: string;
  ownership?: string;
  structure?: string;
  yearBuilt?: number | string;
  // problem
  serviceRequested?: string;
  leakLocation?: string;
  basementDepthBand?: string;
  linearFeet?: number | string;
  activeLeak?: boolean;
  urgent?: boolean;
  financingInterest?: boolean;
  preferredTimeframe?: string;
  consent?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const IN = {
  preferredContact: ["phone", "email", "text"],
  propertyType: ["residential", "commercial", "industrial", "multi_unit"],
  ownership: ["own", "rent"],
  structure: ["detached", "semi", "townhouse", "other"],
  serviceRequested: ["exterior", "interior", "unsure"],
  leakLocation: ["wall", "floor", "window", "wall_floor_joint", "unsure"],
  basementDepthBand: ["up_to_7", "eight_ft", "nine_plus", "unknown"],
} as const;

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  insert?: SubmissionInsert;
}

function pickEnum(value: unknown, allowed: readonly string[]): string | null {
  return typeof value === "string" && allowed.includes(value) ? value : null;
}

function toNumber(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v));
  return Number.isFinite(n) ? n : null;
}

/** Validate an intake payload and, if valid, build the DB insert row
 *  (with derived pricing-engine fields filled in). */
export function validateIntake(payload: IntakePayload): ValidationResult {
  const errors: string[] = [];

  const fullName = (payload.fullName ?? "").trim();
  const email = (payload.email ?? "").trim();

  if (!fullName) errors.push("Full name is required.");
  if (fullName.length > 200) errors.push("Full name is too long.");
  if (!email || !EMAIL_RE.test(email)) errors.push("A valid email is required.");
  if (email.length > 200) errors.push("Email is too long.");
  if (payload.consent !== true)
    errors.push("Consent is required to submit a request.");

  if (errors.length) return { ok: false, errors };

  const city = (payload.city ?? "").trim() || null;
  const yearBuilt = toNumber(payload.yearBuilt);
  const linearFeet = toNumber(payload.linearFeet);

  const insert: SubmissionInsert = {
    full_name: fullName,
    email,
    phone: (payload.phone ?? "").trim() || null,
    preferred_contact: pickEnum(payload.preferredContact, IN.preferredContact),

    address: (payload.address ?? "").trim() || null,
    city,
    postal_code: (payload.postalCode ?? "").trim().toUpperCase() || null,
    property_type: pickEnum(payload.propertyType, IN.propertyType),
    ownership: pickEnum(payload.ownership, IN.ownership),
    structure: pickEnum(payload.structure, IN.structure),
    year_built: yearBuilt,
    house_age_band: houseAgeBandFromYear(yearBuilt),

    service_requested: pickEnum(payload.serviceRequested, IN.serviceRequested),
    leak_location: pickEnum(payload.leakLocation, IN.leakLocation),
    basement_depth_band: pickEnum(payload.basementDepthBand, IN.basementDepthBand),
    linear_feet: linearFeet,
    active_leak: payload.activeLeak ?? null,
    urgent: payload.urgent ?? null,
    financing_interest: payload.financingInterest ?? null,
    preferred_timeframe: (payload.preferredTimeframe ?? "").trim() || null,

    location_tier: locationTierFromCity(city),
    rebate_city: rebateCityFromCity(city),
    service_area_ok: serviceAreaOk(city),

    consent: true,
    status: "new",
    source: "website",
  };

  return { ok: true, errors: [], insert };
}
