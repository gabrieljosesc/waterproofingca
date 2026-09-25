"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckIcon, PhoneIcon } from "@/components/Icons";
import { site } from "@/lib/site";
import {
  consumePendingConversion,
  markPendingConversion,
  trackLeadSubmitted,
} from "@/lib/analytics";

/** Customer-safe instant estimate, as returned by /api/estimate/[id]/summary. */
export interface EstimateSummary {
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

type Loaded =
  | { kind: "loading" }
  | { kind: "generic" }
  | { kind: "estimate"; estimate: EstimateSummary; accepted: boolean };

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");

/**
 * The confirmation the customer sees after submitting the estimate wizard:
 * their instant estimate with the option to accept it, the "needs a closer
 * look" message when the AI wasn't confident, or a plain thank-you when there
 * was nothing to price (no photos, or storage in demo mode).
 */
export function EstimateResult() {
  const id = useSearchParams().get("id");
  const [state, setState] = useState<Loaded>({ kind: id ? "loading" : "generic" });

  useEffect(() => {
    // The lead conversion counts the submission itself, whatever the outcome.
    if (id && consumePendingConversion("lead", id)) trackLeadSubmitted();
    if (!id) return;

    let cancelled = false;
    fetch(`/api/estimate/${id}/summary`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled) return;
        if (json?.hasEstimate) {
          setState({
            kind: "estimate",
            estimate: json.estimate as EstimateSummary,
            accepted: Boolean(json.accepted),
          });
        } else {
          setState({ kind: "generic" });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "generic" });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.kind === "loading") {
    return (
      <div className="form wizard confirmation">
        <div className="wizard__done-icon wizard__done-icon--spin">
          <span className="wizard__spinner" />
        </div>
        <h1 className="confirmation__title">Loading your estimate…</h1>
      </div>
    );
  }

  if (state.kind === "estimate" && state.estimate.showPrice) {
    return (
      <InstantQuote
        id={id as string}
        instant={state.estimate}
        alreadyAccepted={state.accepted}
      />
    );
  }

  if (state.kind === "estimate") {
    const { estimate } = state;
    return (
      <div className="form wizard confirmation">
        <div className="wizard__done-icon">
          <CheckIcon size={28} />
        </div>
        <span className="eyebrow">Request received</span>
        <h1 className="confirmation__title">
          Thanks — your property needs a closer look
        </h1>
        {estimate.summary && (
          <div className="instant-quote__notes">
            <strong>What our AI noticed in your photos:</strong>
            <p>“{estimate.summary}”</p>
          </div>
        )}
        <p style={{ color: "var(--text-muted)" }}>
          Based on the photos, we can&apos;t put a reliable number on this one
          without seeing it in person — some conditions (like excavation depth
          or access) need eyes on site. Our team will contact you to book a{" "}
          <strong>free site visit</strong> and give you an exact price there.
          If water is actively coming in, call our 24/7 line now.
        </p>
        <a href={site.phoneHref} className="btn btn--primary" style={{ marginTop: 14 }}>
          <PhoneIcon size={18} /> Call {site.phone}
        </a>
      </div>
    );
  }

  return (
    <div className="form wizard confirmation">
      <div className="wizard__done-icon">
        <CheckIcon size={28} />
      </div>
      <span className="eyebrow">Request received</span>
      <h1 className="confirmation__title">Thank you — we&apos;re on it</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Our team is reviewing your details now. You&apos;ll hear back within
        one business day, or much sooner if it&apos;s urgent — adding photos
        helps us give you an instant estimate next time. If water is actively
        coming in, call our 24/7 line for immediate dispatch.
      </p>
      <div className="cta-band__actions" style={{ justifyContent: "flex-start", marginTop: 24 }}>
        <a href={site.phoneHref} className="btn btn--primary">
          <PhoneIcon size={18} /> Call {site.phone}
        </a>
        <Link href="/" className="btn btn--ghost">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function InstantQuote({
  id,
  instant,
  alreadyAccepted,
}: {
  id: string;
  instant: EstimateSummary;
  alreadyAccepted: boolean;
}) {
  const [accepting, setAccepting] = useState(false);
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

  async function acceptQuote() {
    setAccepting(true);
    setAcceptError(null);
    try {
      const res = await fetch(`/api/estimate/${id}/accept`, {
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
      // Drop PAN/CVV from client memory after a successful accept.
      setCard({ nameOnCard: "", cardNumber: "", expMonth: "", expYear: "", cvv: "" });
      // The accepted page fires the conversion on load — mark it, then go.
      markPendingConversion("accept", id);
      window.location.assign(`/estimate/accepted?id=${encodeURIComponent(id)}`);
    } catch (err) {
      setAcceptError(err instanceof Error ? err.message : "Something went wrong.");
      setAccepting(false);
    }
  }

  return (
    <div className="form wizard confirmation">
      <div className="wizard__done-icon">
        <CheckIcon size={28} />
      </div>
      <span className="eyebrow">Request received</span>
      <h1 className="confirmation__title">Your instant estimate</h1>
      <div className="instant-quote">
        <div className="instant-quote__label">Estimated range (before HST)</div>
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
          The final price is confirmed at your <strong>free on-site visit</strong>;
          hidden conditions (soil, utilities, foundation state) can change it.
        </li>
        <li>Estimate valid for {instant.validDays} days.</li>
        {instant.rebate > 0 && (
          <li>
            Rebate figures are estimates only and subject to your
            municipality&apos;s approval.
          </li>
        )}
      </ul>

      {alreadyAccepted ? (
        <div className="instant-quote__accepted">
          <CheckIcon size={20} />
          <div>
            <strong>You&apos;re reserved!</strong>
            <p>
              Your {instant.depositPercent}% refundable deposit (
              {money(instant.depositLow)} – {money(instant.depositHigh)}) is
              ready to process and your priority slot is locked in. We&apos;ll
              be in touch within one business day.
            </p>
          </div>
        </div>
      ) : (
        <div className="instant-quote__accept">
          {acceptError && <div className="form__error">{acceptError}</div>}
          <p style={{ color: "var(--text-muted)" }}>
            Want to lock in your spot? Accepting reserves your project ahead
            of other requests. Enter your card for a {instant.depositPercent}%
            refundable deposit ({money(instant.depositLow)} –{" "}
            {money(instant.depositHigh)}) to hold your place in line. We
            process the deposit after a quick review — it is refundable.
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
                    setCardField("expMonth", e.target.value.replace(/\D/g, "").slice(0, 2))
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
                    setCardField("expYear", e.target.value.replace(/\D/g, "").slice(0, 4))
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
                    setCardField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
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
              {accepting ? "Reserving…" : "Accept Quote & Pay 20% Deposit"}
            </button>
            <a href={site.phoneHref} className="btn btn--ghost">
              <PhoneIcon size={18} /> Call {site.phone}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
