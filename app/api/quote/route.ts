import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Demo mode: no Supabase configured yet — accept the request so the UI
  // flow works, but flag it in the response for developers.
  if (!supabaseUrl || !supabaseKey) {
    console.warn("[quote] Supabase env vars not set — lead not persisted:", {
      name,
      email,
      service,
    });
    return NextResponse.json({ ok: true, stored: false });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
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

  return NextResponse.json({ ok: true, stored: true });
}
