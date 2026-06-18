/* Server-side Supabase client using the SERVICE ROLE key.
   This bypasses RLS — all role scoping (creator/parent/admin) is
   enforced in app logic, never trusted to the client. */
import { createClient } from "@supabase/supabase-js";

export function getServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  return createClient(url, key, { auth: { persistSession: false } });
}
