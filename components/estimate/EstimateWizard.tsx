"use client";

import { useMemo, useState } from "react";
import { CheckIcon } from "@/components/Icons";

type Status = "editing" | "submitting" | "done" | "error";

const PHOTO_GROUPS = [
  {
    type: "wall",
    label: "Foundation wall",
    hint: "The outside wall where water gets in, shot from a few feet back so we can see the whole run.",
  },
  {
    type: "access",
    label: "Access route",
    hint: "The path from the driveway or street to that wall, plus the narrowest point (gate, gap between houses).",
  },
  {
    type: "obstruction",
    label: "Anything in the way",
    hint: "Deck, AC unit, gas meter, stairs, interlock, big trees — whatever sits near the wall.",
  },
  {
    type: "interior",
    label: "Inside the basement",
    hint: "The leak or staining inside, and where the floor meets the wall.",
  },
] as const;

const STEPS = ["Property", "The problem", "Photos", "Your details"] as const;

export function EstimateWizard() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("editing");
  const [error, setError] = useState<string | null>(null);

  // form state
  const [form, setForm] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k: string, v: boolean) => setFlags((f) => ({ ...f, [k]: v }));

  const photoCount = useMemo(
    () => Object.values(files).reduce((n, arr) => n + arr.length, 0),
    [files]
  );

  const canSubmit =
    (form.fullName ?? "").trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email ?? "") &&
    flags.consent === true;

  async function submit() {
    setStatus("submitting");
    setError(null);
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        preferredContact: form.preferredContact,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        propertyType: form.propertyType,
        ownership: form.ownership,
        structure: form.structure,
        yearBuilt: form.yearBuilt,
        serviceRequested: form.serviceRequested,
        leakLocation: form.leakLocation,
        basementDepthBand: form.basementDepthBand,
        linearFeet: form.linearFeet,
        preferredTimeframe: form.preferredTimeframe,
        activeLeak: flags.activeLeak ?? false,
        urgent: flags.urgent ?? false,
        financingInterest: flags.financingInterest ?? false,
        consent: flags.consent ?? false,
      };

      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");

      // Upload photos if we have a stored submission to attach them to.
      if (json.submissionId && photoCount > 0) {
        const fd = new FormData();
        fd.set("submissionId", json.submissionId);
        for (const group of PHOTO_GROUPS) {
          for (const file of files[group.type] ?? []) {
            fd.append("photos", file);
            fd.append("types", group.type);
          }
        }
        await fetch("/api/estimate/photos", { method: "POST", body: fd });

        // Kick off AI analysis in the background — the owner reviews the draft
        // later, so we don't make the customer wait for it.
        fetch(`/api/estimate/${json.submissionId}/analyze`, {
          method: "POST",
        }).catch(() => {});
      }

      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="form wizard">
        <div className="wizard__done-icon">
          <CheckIcon size={28} />
        </div>
        <h3 style={{ fontSize: "1.4rem", marginBottom: 10 }}>
          Request received — thank you!
        </h3>
        <p style={{ color: "var(--text-muted)" }}>
          Our team is reviewing your photos and details now. You&apos;ll get a
          written estimate range back within one business day, or much sooner if
          it&apos;s urgent. If water is actively coming in, call our 24/7 line
          for immediate dispatch.
        </p>
      </div>
    );
  }

  return (
    <div className="form wizard">
      <div className="wizard__steps">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={
              i === step
                ? "wizard__step wizard__step--active"
                : i < step
                ? "wizard__step wizard__step--done"
                : "wizard__step"
            }
          >
            <span className="wizard__step-num">{i < step ? "✓" : i + 1}</span>
            {label}
          </div>
        ))}
      </div>

      {status === "error" && error && <div className="form__error">{error}</div>}

      {step === 0 && (
        <div>
          <div className="field">
            <label htmlFor="address">Property address</label>
            <input id="address" value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} placeholder="123 Main St" />
          </div>
          <div className="form__row">
            <div className="field">
              <label htmlFor="city">City</label>
              <input id="city" value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} placeholder="Mississauga" />
            </div>
            <div className="field">
              <label htmlFor="postalCode">Postal code</label>
              <input id="postalCode" value={form.postalCode ?? ""} onChange={(e) => set("postalCode", e.target.value)} placeholder="L5B 1M2" />
            </div>
          </div>
          <div className="form__row">
            <div className="field">
              <label htmlFor="propertyType">Property type</label>
              <select id="propertyType" value={form.propertyType ?? ""} onChange={(e) => set("propertyType", e.target.value)}>
                <option value="">Select…</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="multi_unit">Multi-unit</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="structure">Structure</label>
              <select id="structure" value={form.structure ?? ""} onChange={(e) => set("structure", e.target.value)}>
                <option value="">Select…</option>
                <option value="detached">Detached</option>
                <option value="semi">Semi-detached</option>
                <option value="townhouse">Townhouse</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form__row">
            <div className="field">
              <label htmlFor="yearBuilt">Approx. year built</label>
              <input id="yearBuilt" inputMode="numeric" value={form.yearBuilt ?? ""} onChange={(e) => set("yearBuilt", e.target.value)} placeholder="1965" />
            </div>
            <div className="field">
              <label htmlFor="ownership">Do you own or rent?</label>
              <select id="ownership" value={form.ownership ?? ""} onChange={(e) => set("ownership", e.target.value)}>
                <option value="">Select…</option>
                <option value="own">Own</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <div className="field">
            <label htmlFor="serviceRequested">What do you think you need?</label>
            <select id="serviceRequested" value={form.serviceRequested ?? ""} onChange={(e) => set("serviceRequested", e.target.value)}>
              <option value="">Not sure — help me figure it out</option>
              <option value="exterior">Exterior waterproofing</option>
              <option value="interior">Interior waterproofing</option>
            </select>
          </div>
          <div className="form__row">
            <div className="field">
              <label htmlFor="leakLocation">Where is the water coming in?</label>
              <select id="leakLocation" value={form.leakLocation ?? ""} onChange={(e) => set("leakLocation", e.target.value)}>
                <option value="">Select…</option>
                <option value="wall">Through the wall</option>
                <option value="floor">Up through the floor</option>
                <option value="window">A basement window / well</option>
                <option value="wall_floor_joint">Where the wall meets the floor</option>
                <option value="unsure">Not sure</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="basementDepthBand">How deep is the basement?</label>
              <select id="basementDepthBand" value={form.basementDepthBand ?? ""} onChange={(e) => set("basementDepthBand", e.target.value)}>
                <option value="">Select…</option>
                <option value="up_to_7">Up to 7 ft</option>
                <option value="eight_ft">About 8 ft</option>
                <option value="nine_plus">9 ft or deeper</option>
                <option value="unknown">Not sure</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="linearFeet">Roughly how long is the affected wall? (feet, optional)</label>
            <input id="linearFeet" inputMode="numeric" value={form.linearFeet ?? ""} onChange={(e) => set("linearFeet", e.target.value)} placeholder="e.g. 30" />
          </div>
          <label className="wizard__check">
            <input type="checkbox" checked={flags.activeLeak ?? false} onChange={(e) => toggle("activeLeak", e.target.checked)} />
            Water is coming in right now
          </label>
          <label className="wizard__check">
            <input type="checkbox" checked={flags.urgent ?? false} onChange={(e) => toggle("urgent", e.target.checked)} />
            This is urgent
          </label>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="wizard__intro">
            Photos are what let us give you a real number instead of a guess.
            Add what you can — the more complete, the tighter the estimate. Skip
            any you can&apos;t get to right now.
          </p>
          {PHOTO_GROUPS.map((group) => (
            <div key={group.type} className="wizard__photo">
              <div className="wizard__photo-head">
                <strong>{group.label}</strong>
                <span>{(files[group.type] ?? []).length} added</span>
              </div>
              <p className="wizard__photo-hint">{group.hint}</p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) =>
                  setFiles((prev) => ({
                    ...prev,
                    [group.type]: Array.from(e.target.files ?? []),
                  }))
                }
              />
            </div>
          ))}
          <p className="form__note">
            {photoCount} photo{photoCount === 1 ? "" : "s"} selected. Please
            don&apos;t include photos of people. JPG, PNG or WebP, up to 15 MB each.
          </p>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="form__row">
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" value={form.fullName ?? ""} onChange={(e) => set("fullName", e.target.value)} placeholder="John Smith" required />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} placeholder="(905) 555-0000" />
            </div>
          </div>
          <div className="form__row">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="field">
              <label htmlFor="preferredContact">Preferred contact</label>
              <select id="preferredContact" value={form.preferredContact ?? ""} onChange={(e) => set("preferredContact", e.target.value)}>
                <option value="">Select…</option>
                <option value="phone">Phone call</option>
                <option value="text">Text</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="preferredTimeframe">Preferred timeframe (optional)</label>
            <input id="preferredTimeframe" value={form.preferredTimeframe ?? ""} onChange={(e) => set("preferredTimeframe", e.target.value)} placeholder="e.g. within a month" />
          </div>
          <label className="wizard__check">
            <input type="checkbox" checked={flags.financingInterest ?? false} onChange={(e) => toggle("financingInterest", e.target.checked)} />
            I&apos;m interested in financing (pay monthly)
          </label>
          <label className="wizard__check">
            <input type="checkbox" checked={flags.consent ?? false} onChange={(e) => toggle("consent", e.target.checked)} />
            <span>
              I agree to be contacted about this request, I understand any
              estimate is preliminary and confirmed on site, and I accept the{" "}
              <a href="/terms" target="_blank" style={{ color: "var(--accent)" }}>
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" style={{ color: "var(--accent)" }}>
                Privacy Policy
              </a>{" "}
              (including AI analysis of my photos).
            </span>
          </label>
        </div>
      )}

      <div className="wizard__nav">
        {step > 0 ? (
          <button type="button" className="btn btn--ghost" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn btn--primary" onClick={() => setStep((s) => s + 1)}>
            Continue
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            disabled={!canSubmit || status === "submitting"}
            onClick={submit}
          >
            {status === "submitting" ? "Sending…" : "Submit for a free estimate"}
          </button>
        )}
      </div>
    </div>
  );
}
