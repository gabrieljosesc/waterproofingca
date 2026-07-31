"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/browser";
import {
  AdminTopbar,
  StatusBadge,
  money,
  useRequireSession,
} from "@/components/admin/shared";
import type { Database } from "@/lib/supabase/types";

type EstimateSummary = {
  status: string;
  ai_confidence: number | null;
  range_low: number | null;
  range_high: number | null;
};

type SubmissionRow =
  Database["public"]["Tables"]["estimate_submissions"]["Row"] & {
    /** PostgREST returns an object for this to-one embed (unique FK), but an
     *  array shape is possible depending on schema detection — handle both. */
    submission_estimates: EstimateSummary | EstimateSummary[] | null;
  };

function estimateOf(row: SubmissionRow): EstimateSummary | null {
  const e = row.submission_estimates;
  if (!e) return null;
  return Array.isArray(e) ? (e[0] ?? null) : e;
}

export default function AdminListPage() {
  const { ready, email } = useRequireSession();
  const [rows, setRows] = useState<SubmissionRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    const supabase = createBrowserClient();
    supabase
      .from("estimate_submissions")
      .select(
        "*, submission_estimates(status, ai_confidence, range_low, range_high)"
      )
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setRows((data as unknown as SubmissionRow[]) ?? []);
      });
  }, [ready]);

  if (!ready) return null;

  return (
    <section className="section" style={{ minHeight: "70vh" }}>
      <div className="container">
        <AdminTopbar email={email} />
        <h1 className="section-title" style={{ fontSize: "1.9rem" }}>
          Estimate requests
        </h1>

        {error && <div className="form__error">{error}</div>}
        {rows && rows.length === 0 && (
          <p className="section-lead">
            No submissions yet. They&apos;ll appear here as customers use the
            photo-estimate tool.
          </p>
        )}

        {rows && rows.length > 0 && (
          <div className="admin-tablewrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Received</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Service</th>
                  <th>AI conf.</th>
                  <th>Draft range</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const est = estimateOf(r);
                  return (
                    <tr key={r.id}>
                      <td>
                        {new Date(r.created_at).toLocaleDateString("en-CA", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        <strong>{r.full_name}</strong>
                        <div className="admin-sub">{r.email}</div>
                      </td>
                      <td>{r.city ?? "—"}</td>
                      <td>{r.service_requested ?? "—"}</td>
                      <td>
                        {est?.ai_confidence != null
                          ? `${Math.round(Number(est.ai_confidence))}%`
                          : "—"}
                      </td>
                      <td>
                        {est
                          ? `${money(est.range_low)} – ${money(est.range_high)}`
                          : "—"}
                      </td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                      <td>
                        <Link href={`/admin/${r.id}`} className="card__link">
                          Review →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
