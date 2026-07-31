"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let client: SupabaseClient<Database> | null = null;

/**
 * Browser Supabase client for the owner dashboard. Uses the public anon key;
 * row-level security (the `is_admin()` allowlist) is the actual security
 * boundary — a signed-in non-admin sees zero rows.
 */
export function createBrowserClient(): SupabaseClient<Database> {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase public env vars are not set.");
  }
  client = createClient<Database>(url, anonKey);
  return client;
}
