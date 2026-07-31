import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { ownerAlertAddress, sendEmail } from "@/lib/email/resend";
import { ownerAlertEmail } from "@/lib/email/templates";

const VALID_PROPERTY_TYPES = ["residential", "commercial"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const service = String(body.service ?? "").trim();
  const message = String(body.message ?? "").trim();
  const propertyTypeRaw = String(body.property_type ?? "residential").trim();
  const property_type = VALID_PROPERTY_TYPES.includes(propertyTypeRaw)
    ? propertyTypeRaw
    : "residential";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 }
    );
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Input too long." }, { status: 400 });
  }

  // Demo mode: no service-role key configured yet — accept the request so the
  // UI flow works, but persist nothing.
  if (!isSupabaseConfigured()) {
    console.warn("[quote] Supabase not configured — lead not persisted:", {
      name,
      email,
      service,
    });
    return NextResponse.json({ ok: true, stored: false });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("quote_requests").insert({
    name,
    email,
    phone: phone || null,
    service: service || null,
    property_type,
    message,
    source: "website",
  });

  if (error) {
    console.error("[quote] Supabase insert failed:", error.message);
    return NextResponse.json(
      { error: "Could not save your request. Please call us instead." },
      { status: 500 }
    );
  }

  // Owner alert — never fatal to the lead.
  const alert = ownerAlertEmail({
    kind: "contact",
    name,
    email,
    phone: phone || null,
    service: service || null,
    message,
  });
  await sendEmail({
    to: ownerAlertAddress(),
    subject: alert.subject,
    html: alert.html,
    text: alert.text,
    replyTo: email,
  });

  return NextResponse.json({ ok: true, stored: true });
}
