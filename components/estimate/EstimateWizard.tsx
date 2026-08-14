"use client";

import { useMemo, useState } from "react";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { site } from "@/lib/site";
import { trackLeadSubmitted, trackQuoteAccepted } from "@/lib/analytics";

type Status = "editing" | "submitting" | "analyzing" | "done" | "error";

/** Customer-safe instant estimate returned by /api/estimate/[id]/analyze. */
interface InstantEstimate {
  showPrice: boolean;
  rangeLow: number;
  rangeHigh: number;
  rebate: number;
  netLow: number;
  netHigh: number;
  rebateCity: string | null;
  summary?: string;
  confidence: number;
  validDays: number;
  depositPercent: number;
  depositLow: number;
  depositHigh: number;
}

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");

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
  const [instant, setInstant] = useState<InstantEstimate | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [card, setCard] = useState({
    nameOnCard: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  });
  const setCardField = (k: keyof typeof card, v: string) =>
    setCard((c) => ({ ...c, [k]: v }));

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
      setSubmissionId(json.submissionId ?? null);
      if (json.submissionId) trackLeadSubmitted();

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

        // Instant AI estimate: analyze now and show the customer the range.
        // Any failure falls back to the plain "we'll be in touch" message.
        setStatus("analyzing");
        try {
          const aRes = await fetch(`/api/estimate/${json.submissionId}/analyze`, {
            method: "POST",
          });
          const aJson = await aRes.json();
          if (aRes.ok && aJson.analyzed && aJson.customer) {
            setInstant(aJson.customer as InstantEstimate);
          }
        } catch {
          // fall through to the generic confirmation
        }
      }

      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  async function acceptQuote() {
    if (!submissionId) return;
    setAccepting(true);
    setAcceptError(null);
    try {
      const res = await fetch(`/api/estimate/${submissionId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameOnCard: card.nameOnCard,
          cardNumber: card.cardNumber,
          expMonth: card.expMonth,
          expYear: card.expYear,
          cvv: card.cvv,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setAccepted(true);
      trackQuoteAccepted(instant?.depositLow ?? 0);
      // Drop PAN/CVV from client memory after a successful accept.
      setCard({
        nameOnCard: "",
        cardNumber: "",
        expMonth: "",
        expYear: "",
        cvv: "",
      });
    } catch (err) {
      setAcceptError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setAccepting(false);
    }
  }

  if (status === "analyzing") {
    return (
      <div className="form wizard">
        <div className="wizard__done-icon wizard__done-icon--spin">
          <span className="wizard__spinner" />
        </div>
        <h3 style={{ fontSize: "1.4rem", marginBottom: 10 }}>
          Our AI is reviewing your photos…
        </h3>
        <p style={{ color: "var(--text-muted)" }}>
          It&apos;s reading your foundation wall, access route and site
          conditions to build your estimate. This usually takes about 15
          seconds — please keep this page open.
        </p>
      </div>
    );
  }

  if (status === "done" && instant?.showPrice) {
    return (
      <div className="form wizard">
        <div className="wizard__done-icon">
          <CheckIcon size={28} />
        </div>
        <h3 style={{ fontSize: "1.4rem", marginBottom: 6 }}>
          Your instant estimate
        </h3>
        <div className="instant-quote">
          <div className="instant-quote__label">
            Estimated range (before HST)
          </div>
          <div className="instant-quote__figure">
            {money(instant.rangeLow)} – {money(instant.rangeHigh)}
          </div>
          {instant.rebate > 0 && (
            <div className="instant-quote__rebate">
              Est. municipal rebate on eligible items
              {instant.rebateCity ? ` (${instant.rebateCity})` : ""}: −
              {money(instant.rebate)}
              <div className="instant-quote__net">
                Est. net after rebate: {money(instant.netLow)} –{" "}
                {money(instant.netHigh)}
              </div>
            </div>
          )}
        </div>

        {instant.summary && (
          <div className="instant-quote__notes">
            <strong>What our AI noticed in your photos:</strong>
            <p>“{instant.summary}”</p>
          </div>
        )}

        <ul className="instant-quote__terms">
          <li>
            This is a preliminary estimate based on your photos — not a final
            price.
          </li>
          <li>
            The final price is confirmed at your <strong>free on-site
            visit</strong>; hidden conditions (soil, utilities, foundation
            state) can change it.
          </li>
          <li>Estimate valid for {instant.validDays} days.</li>
          {instant.rebate > 0 && (
            <li>
              Rebate figures are estimates only and subject to your
              municipality&apos;s approval.
            </li>
          )}
        </ul>

        {accepted ? (
          <div className="instant-quote__accepted">
            <CheckIcon size={20} />
            <div>
              <strong>You&apos;re reserved!</strong>
              <p>
                Your {instant.depositPercent}% refundable deposit (
                {money(instant.depositLow)} – {money(instant.depositHigh)}) is
                ready to process and your priority slot is locked in. This is
                still a preliminary estimate — final pricing is confirmed at
                your free on-site visit. We&apos;ll be in touch within one
                business day.
              </p>
            </div>
          </div>
        ) : (
          <div className="instant-quote__accept">
            {acceptError && <div className="form__error">{acceptError}</div>}
            <p style={{ color: "var(--text-muted)" }}>
              Want to lock in your spot? Accepting reserves your project ahead
              of other requests. Enter your card for a{" "}
              {instant.depositPercent}% refundable deposit (
              {money(instant.depositLow)} – {money(instant.depositHigh)}) to
              hold your place in line. We process the deposit after a quick
              review — it is refundable.
            </p>
            <div className="deposit-card-form">
              <div className="field">
                <label htmlFor="nameOnCard">Name on card</label>
                <input
                  id="nameOnCard"
                  autoComplete="cc-name"
                  value={card.nameOnCard}
                  onChange={(e) => setCardField("nameOnCard", e.target.value)}
                  placeholder="As shown on the card"
                />
              </div>
              <div className="field">
                <label htmlFor="cardNumber">Card number</label>
                <input
                  id="cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={card.cardNumber}
                  onChange={(e) =>
                    setCardField(
                      "cardNumber",
                      e.target.value.replace(/[^\d\s]/g, "").slice(0, 23)
                    )
                  }
                  placeholder="•••• •••• •••• ••••"
                />
              </div>
              <div className="form__row deposit-card-form__row">
                <div className="field">
                  <label htmlFor="expMonth">Exp. month</label>
                  <input
                    id="expMonth"
                    inputMode="numeric"
                    autoComplete="cc-exp-month"
                    value={card.expMonth}
                    onChange={(e) =>
                      setCardField(
                        "expMonth",
                        e.target.value.replace(/\D/g, "").slice(0, 2)
                      )
                    }
                    placeholder="MM"
                  />
                </div>
                <div className="field">
                  <label htmlFor="expYear">Exp. year</label>
                  <input
                    id="expYear"
                    inputMode="numeric"
                    autoComplete="cc-exp-year"
                    value={card.expYear}
                    onChange={(e) =>
                      setCardField(
                        "expYear",
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                    placeholder="YYYY"
                  />
                </div>
                <div className="field">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    id="cvv"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={card.cvv}
                    onChange={(e) =>
                      setCardField(
                        "cvv",
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                    placeholder="•••"
                  />
                </div>
              </div>
              <p className="form__note">
                Your full card number is not saved in our database. It is only
                available to our team in the secure admin dashboard to process
                your refundable deposit, then cleared.
              </p>
            </div>
            <div className="cta-band__actions" style={{ justifyContent: "flex-start" }}>
              <button
                type="button"
                className="btn btn--primary"
                onClick={acceptQuote}
                disabled={accepting}
              >
                {accepting
                  ? "Reserving…"
                  : "Accept Quote & Pay 20% Deposit"}
              </button>
              <a href={site.phoneHref} className="btn btn--ghost">
                <PhoneIcon size={18} /> Call {site.phone}
              </a>
              <a
                href={site.whatsappHref}
                className="btn btn--ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={18} /> WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (status === "done" && instant && !instant.showPrice) {
    return (
      <div className="form wizard">
        <div className="wizard__done-icon">
          <CheckIcon size={28} />
        </div>
        <h3 style={{ fontSize: "1.4rem", marginBottom: 10 }}>
          Thanks — your property needs a closer look
        </h3>
        {instant.summary && (
          <div className="instant-quote__notes">
            <strong>What our AI noticed in your photos:</strong>
            <p>“{instant.summary}”</p>
          </div>
        )}
        <p style={{ color: "var(--text-muted)" }}>
          Based on the photos, we can&apos;t put a reliable number on this one
          without seeing it in person — some conditions (like excavation depth
          or access) need eyes on site. Our team will contact you to book a{" "}
          <strong>free site visit</strong> and give you an exact price there.
          If water is actively coming in, call our 24/7 line now.
        </p>
        <div className="cta-band__actions" style={{ justifyContent: "flex-start", marginTop: 14 }}>
          <a href={site.phoneHref} className="btn btn--primary">
            <PhoneIcon size={18} /> Call {site.phone}
          </a>
          <a
            href={site.whatsappHref}
            className="btn btn--ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={18} /> WhatsApp
          </a>
        </div>
      </div>
    );
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
          Our team is reviewing your details now. You&apos;ll hear back within
          one business day, or much sooner if it&apos;s urgent — adding photos
          helps us give you an instant estimate next time. If water is actively
          coming in, call our 24/7 line for immediate dispatch.
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
