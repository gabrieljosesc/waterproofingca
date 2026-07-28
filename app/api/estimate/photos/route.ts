import { NextResponse } from "next/server";
import {
  createAdminClient,
  isSupabaseConfigured,
  SUBMISSION_PHOTO_BUCKET,
} from "@/lib/supabase/admin";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB, matches the bucket limit
const MAX_FILES = 20;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_TYPES = new Set([
  "wall",
  "access",
  "obstruction",
  "interior",
  "surface",
  "other",
]);

const extFor = (mime: string) =>
  mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";

/**
 * Upload one or more photos for a submission. Multipart form with:
 *   - submissionId: string
 *   - photos: File[]   (repeated field)
 *   - types:  string[] (repeated field, parallel to photos; optional)
 *
 * Files are validated server-side and stored in the private bucket via the
 * service role; a metadata row is written for each.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const submissionId = String(form.get("submissionId") ?? "").trim();
  if (!submissionId) {
    return NextResponse.json(
      { error: "Missing submission id." },
      { status: 400 }
    );
  }

  const files = form.getAll("photos").filter((f): f is File => f instanceof File);
  const types = form.getAll("types").map((t) => String(t));

  if (files.length === 0) {
    return NextResponse.json({ error: "No photos provided." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Too many photos (max ${MAX_FILES}).` },
      { status: 400 }
    );
  }

  for (const file of files) {
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${file.type || "unknown"}.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `A photo exceeds the 15 MB limit.` },
        { status: 400 }
      );
    }
  }

  if (!isSupabaseConfigured()) {
    console.warn(
      `[estimate] Supabase not configured — ${files.length} photo(s) not stored.`
    );
    return NextResponse.json({ ok: true, stored: false, uploaded: 0 });
  }

  const supabase = createAdminClient();
  let uploaded = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const type = ALLOWED_TYPES.has(types[i]) ? types[i] : "other";
    const path = `${submissionId}/${crypto.randomUUID()}.${extFor(file.type)}`;

    const { error: upErr } = await supabase.storage
      .from(SUBMISSION_PHOTO_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (upErr) {
      console.error("[estimate] photo upload failed:", upErr.message);
      continue;
    }

    const { error: rowErr } = await supabase.from("submission_photos").insert({
      submission_id: submissionId,
      storage_path: path,
      photo_type: type,
      bytes: file.size,
    });
    if (rowErr) {
      console.error("[estimate] photo row insert failed:", rowErr.message);
      continue;
    }
    uploaded++;
  }

  return NextResponse.json({ ok: true, stored: true, uploaded });
}
