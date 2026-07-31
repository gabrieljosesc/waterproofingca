import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { validateIntake, type IntakePayload } from "@/lib/estimate/schema";
import { appBaseUrl, ownerAlertAddress, sendEmail } from "@/lib/email/resend";
import { ownerAlertEmail } from "@/lib/email/templates";

/**
 * Create an estimate submission from the customer intake wizard.
 * Returns the new submission id so the client can then upload photos.
 * Runs in demo mode (no persistence) until the Supabase service-role key is set.
 */
export async function POST(request: Request) {
  let body: IntakePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = validateIntake(body);
  if (!result.ok || !result.insert) {
    return NextResponse.json(
      { error: result.errors.join(" ") || "Invalid submission." },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    console.warn("[estimate] Supabase not configured — submission not stored:", {
      email: result.insert.email,
      city: result.insert.city,
    });
    return NextResponse.json({ ok: true, stored: false, submissionId: null });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("estimate_submissions")
    .insert(result.insert)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[estimate] insert failed:", error?.message);
    return NextResponse.json(
      { error: "Could not save your request. Please call us instead." },
      { status: 500 }
    );
  }

  // Owner alert — never fatal to the customer's submission.
  const alert = ownerAlertEmail({
    kind: "estimate",
    name: result.insert.full_name,
    email: result.insert.email,
    phone: result.insert.phone,
    city: result.insert.city,
    service: result.insert.service_requested,
    urgent: result.insert.urgent ?? false,
    activeLeak: result.insert.active_leak ?? false,
    dashboardUrl: `${appBaseUrl()}/admin/${data.id}`,
  });
  await sendEmail({
    to: ownerAlertAddress(),
    subject: alert.subject,
    html: alert.html,
    text: alert.text,
    replyTo: result.insert.email,
  });

  return NextResponse.json({ ok: true, stored: true, submissionId: data.id });
}
