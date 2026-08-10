"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";

/** Redirects to /admin/login when there's no session. UX guard only — the
 *  real security boundary is RLS (non-admins see zero rows regardless). */
export function useRequireSession(): { ready: boolean; email: string | null } {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
      } else {
        setEmail(data.session.user.email ?? null);
        setReady(true);
      }
    });
  }, [router]);

  return { ready, email };
}

export function money(n: number | string | null | undefined): string {
  if (n === null || n === undefined) return "—";
  const num = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(num)) return "—";
  return "$" + Math.round(num).toLocaleString("en-CA");
}

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  ai_analyzed: "AI drafted",
  needs_review: "Needs review",
  accepted: "Accepted — deposit card on file",
  approved: "Approved",
  sent: "Sent",
  more_photos_requested: "More photos",
  site_visit: "Site visit",
  declined: "Declined",
  outside_area: "Outside area",
};

export function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "new";
  return (
    <span className={`badge badge--${s}`}>{STATUS_LABELS[s] ?? s}</span>
  );
}

export function AdminTopbar({ email }: { email: string | null }) {
  const router = useRouter();
  async function signOut() {
    await createBrowserClient().auth.signOut();
    router.replace("/admin/login");
  }
  return (
    <div className="admin-topbar">
      <div>
        <span className="eyebrow" style={{ marginBottom: 4 }}>
          Owner Dashboard
        </span>
      </div>
      <div className="admin-topbar__right">
        <span className="admin-topbar__email">{email}</span>
        <button className="btn btn--ghost" onClick={signOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
