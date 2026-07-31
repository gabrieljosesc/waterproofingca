"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import {
  AdminTopbar,
  StatusBadge,
  money,
  useRequireSession,
} from "@/components/admin/shared";
import type { Database } from "@/lib/supabase/types";

type Submission = Database["public"]["Tables"]["estimate_submissions"]["Row"];
type Estimate = Database["public"]["Tables"]["submission_estimates"]["Row"];

interface AiConditions {
  access?: string;
  access_confidence?: number;
  ground_surfaces?: string[];
  obstructions?: Array<{ label: string; near_wall: boolean }>;
  foundation_type?: string;
  visible_cracks?: boolean;
  crack_count?: number;
  leak_location_visible?: string;
  grade_slope?: string;
  photo_quality?: string;
  overall_confidence?: number;
  summary?: string;
  mapping_warnings?: string[];
}

interface EngineOutput {
  lineItems?: Array<{ label: string; amount: number; note?: string }>;
  minimumApplied?: boolean;
  rebate?: { estimatedRebate: number; note?: string | null };
  notes?: string[];
}

const INTAKE_FIELDS: Array<[keyof Submission, string]> = [
  ["address", "Address"],
  ["city", "City"],
  ["postal_code", "Postal code"],
  ["property_type", "Property type"],
  ["structure", "Structure"],
  ["ownership", "Own / rent"],
  ["year_built", "Year built"],
  ["service_requested", "Service requested"],
  ["leak_location", "Leak location"],
  ["basement_depth_band", "Basement depth"],
  ["linear_feet", "Wall length (ft)"],
  ["preferred_timeframe", "Timeframe"],
  ["phone", "Phone"],
  ["preferred_contact", "Preferred contact"],
];

export default function AdminDetailPage() {
  const { ready, email } = useRequireSession();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [finalLow, setFinalLow] = useState<string>("");
  const [finalHigh, setFinalHigh] = useState<string>("");
  const [ownerNote, setOwnerNote] = useState<string>("");

  const load = useCallback(async () => {
    const supabase = createBrowserClient();
    const [{ data: sub, error: e1 }, { data: est }, { data: photos }] =
      await Promise.all([
        supabase.from("estimate_submissions").select("*").eq("id", id).single(),
        supabase
          .from("submission_estimates")
          .select("*")
          .eq("submission_id", id)
          .maybeSingle(),
        supabase
          .from("submission_photos")
          .select("storage_path")
          .eq("submission_id", id),
      ]);
    if (e1) {
      setError(e1.message);
      return;
    }
    setSubmission(sub);
    setEstimate(est ?? null);
    if (est) {
      setFinalLow(String(est.final_low ?? est.range_low ?? ""));
      setFinalHigh(String(est.final_high ?? est.range_high ?? ""));
    }
    if (photos?.length) {
      const { data: signed } = await supabase.storage
        .from("submission-photos")
        .createSignedUrls(
          photos.map((p) => p.storage_path),
          3600
        );
      setPhotoUrls(
        (signed ?? []).map((s) => s.signedUrl).filter((u): u is string => !!u)
      );
    }
  }, [id]);

  useEffect(() => {
    if (ready) load();
  }, [ready, load]);

  async function setStatus(status: string) {
    setBusy(true);
    setNotice(null);
    setError(null);
    const supabase = createBrowserClient();
    const { error: e } = await supabase
      .from("estimate_submissions")
      .update({ status })
      .eq("id", id);
    setBusy(false);
    if (e) {
      setError(e.message);
      return;
    }
    setNotice("Status updated.");
    load();
  }

  async function approveAndSend() {
    const low = Number(finalLow);
    const high = Number(finalHigh);
    if (!Number.isFinite(low) || !Number.isFinite(high) || low <= 0 || high < low) {
      setError("Enter a valid final range before approving (low ≤ high).");
      return;
    }
    setBusy(true);
    setNotice(null);
    setError(null);

    const supabase = createBrowserClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      setBusy(false);
      setError("Session expired — sign in again.");
      return;
    }

    try {
      const res = await fetch("/api/admin/send-estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          submissionId: id,
          finalLow: low,
          finalHigh: high,
          note: ownerNote,
        }),
      });
      const json = await res.json();
      setBusy(false);
      if (!res.ok) {
        setError(json.error ?? "Something went wrong.");
        return;
      }
      setNotice(
        json.emailed
          ? "Approved and emailed to the customer. ✅"
          : json.warning ?? "Approved; email not sent."
      );
      load();
    } catch {
      setBusy(false);
      setError("Network error — try again.");
    }
  }

  if (!ready) return null;

  const conditions = (estimate?.ai_conditions ?? {}) as AiConditions;
  const output = (estimate?.engine_output ?? {}) as EngineOutput;

  return (
    <section className="section" style={{ minHeight: "70vh" }}>
      <div className="container">
        <AdminTopbar email={email} />
        <div className="breadcrumb">
          <Link href="/admin">← All requests</Link>
        </div>

        {error && <div className="form__error">{error}</div>}
        {notice && <div className="admin-notice">{notice}</div>}

        {submission && (
          <>
            <div className="admin-head">
              <div>
                <h1 className="section-title" style={{ fontSize: "1.7rem" }}>
                  {submission.full_name}
                </h1>
                <p className="admin-sub">
                  {submission.email}
                  {submission.phone ? ` · ${submission.phone}` : ""} ·{" "}
                  {new Date(submission.created_at).toLocaleString("en-CA")}
                </p>
              </div>
              <StatusBadge status={submission.status} />
            </div>

            <div className="admin-grid">
              {/* Left: customer + photos */}
              <div>
                <div className="card admin-card">
                  <h3>Customer details</h3>
                  <dl className="admin-dl">
                    {INTAKE_FIELDS.map(([key, label]) => {
                      const value = submission[key];
                      if (value === null || value === undefined || value === "")
                        return null;
                      return (
                        <div key={String(key)}>
                          <dt>{label}</dt>
                          <dd>{String(value)}</dd>
                        </div>
                      );
                    })}
                    {submission.active_leak && (
                      <div>
                        <dt>Active leak</dt>
                        <dd>⚠️ Yes</dd>
                      </div>
                    )}
                    {submission.urgent && (
                      <div>
                        <dt>Urgent</dt>
                        <dd>⚠️ Yes</dd>
                      </div>
                    )}
                    {submission.financing_interest && (
                      <div>
                        <dt>Financing</dt>
                        <dd>Interested</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="card admin-card">
                  <h3>Photos ({photoUrls.length})</h3>
                  {photoUrls.length === 0 && (
                    <p className="admin-sub">No photos uploaded.</p>
                  )}
                  <div className="admin-photos">
                    {photoUrls.map((url) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Customer submitted photo" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: AI read + pricing + actions */}
              <div>
                {estimate ? (
                  <>
                    <div className="card admin-card">
                      <h3>
                        What the AI read{" "}
                        {conditions.overall_confidence != null && (
                          <span className="admin-sub">
                            ({conditions.overall_confidence}% confident)
                          </span>
                        )}
                      </h3>
                      {conditions.summary && (
                        <p className="admin-ai-summary">“{conditions.summary}”</p>
                      )}
                      <dl className="admin-dl">
                        <div>
                          <dt>Access</dt>
                          <dd>
                            {conditions.access ?? "—"}
                            {conditions.access_confidence != null
                              ? ` (${conditions.access_confidence}%)`
                              : ""}
                          </dd>
                        </div>
                        <div>
                          <dt>Ground surfaces</dt>
                          <dd>{conditions.ground_surfaces?.join(", ") || "—"}</dd>
                        </div>
                        <div>
                          <dt>Obstructions</dt>
                          <dd>
                            {conditions.obstructions?.length
                              ? conditions.obstructions
                                  .map(
                                    (o) =>
                                      `${o.label}${o.near_wall ? " (at wall)" : ""}`
                                  )
                                  .join(", ")
                              : "None seen"}
                          </dd>
                        </div>
                        <div>
                          <dt>Foundation</dt>
                          <dd>{conditions.foundation_type ?? "—"}</dd>
                        </div>
                        <div>
                          <dt>Cracks visible</dt>
                          <dd>
                            {conditions.visible_cracks
                              ? `Yes (${conditions.crack_count ?? "?"})`
                              : "No"}
                          </dd>
                        </div>
                        <div>
                          <dt>Photo quality</dt>
                          <dd>{conditions.photo_quality ?? "—"}</dd>
                        </div>
                      </dl>
                      {!!conditions.mapping_warnings?.length && (
                        <ul className="admin-warnings">
                          {conditions.mapping_warnings.map((w) => (
                            <li key={w}>⚠️ {w}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="card admin-card">
                      <h3>Draft pricing</h3>
                      <table className="admin-lines">
                        <tbody>
                          {output.lineItems?.map((li) => (
                            <tr key={li.label}>
                              <td>
                                {li.label}
                                {li.note && (
                                  <div className="admin-sub">{li.note}</div>
                                )}
                              </td>
                              <td className="admin-amount">{money(li.amount)}</td>
                            </tr>
                          ))}
                          <tr className="admin-total">
                            <td>AI draft range</td>
                            <td className="admin-amount">
                              {money(estimate.range_low)} –{" "}
                              {money(estimate.range_high)}
                            </td>
                          </tr>
                          {Number(estimate.rebate_amount) > 0 && (
                            <>
                              <tr>
                                <td>Est. municipal rebate (eligible items)</td>
                                <td className="admin-amount">
                                  −{money(estimate.rebate_amount)}
                                </td>
                              </tr>
                              <tr className="admin-total">
                                <td>Net after rebate</td>
                                <td className="admin-amount">
                                  {money(estimate.net_low)} –{" "}
                                  {money(estimate.net_high)}
                                </td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="card admin-card">
                      <h3>Your review</h3>
                      <div className="form__row">
                        <div className="field">
                          <label htmlFor="finalLow">Final range — low ($)</label>
                          <input
                            id="finalLow"
                            inputMode="numeric"
                            value={finalLow}
                            onChange={(e) => setFinalLow(e.target.value)}
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="finalHigh">Final range — high ($)</label>
                          <input
                            id="finalHigh"
                            inputMode="numeric"
                            value={finalHigh}
                            onChange={(e) => setFinalHigh(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label htmlFor="ownerNote">Adjustment note (optional)</label>
                        <input
                          id="ownerNote"
                          value={ownerNote}
                          onChange={(e) => setOwnerNote(e.target.value)}
                          placeholder="e.g. bumped high end for the deck removal"
                        />
                      </div>
                      <div className="admin-actions">
                        <button
                          className="btn btn--primary"
                          disabled={busy}
                          onClick={approveAndSend}
                        >
                          {busy ? "Working…" : "Approve & email customer"}
                        </button>
                        <button
                          className="btn btn--ghost"
                          disabled={busy}
                          onClick={() => setStatus("more_photos_requested")}
                        >
                          Request more photos
                        </button>
                        <button
                          className="btn btn--ghost"
                          disabled={busy}
                          onClick={() => setStatus("site_visit")}
                        >
                          Book site visit
                        </button>
                        <button
                          className="btn btn--danger"
                          disabled={busy}
                          onClick={() => setStatus("declined")}
                        >
                          Decline
                        </button>
                      </div>
                      <p className="form__note">
                        Approving saves your final range and emails the estimate
                        to the customer. If email isn&apos;t configured yet, the
                        approval still saves and you&apos;ll be told to send it
                        manually.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="card admin-card">
                    <h3>No AI estimate yet</h3>
                    <p className="admin-sub">
                      This submission hasn&apos;t been analyzed (no photos, or
                      analysis is still running).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
