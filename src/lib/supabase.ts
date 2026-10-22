import { createClient } from "@supabase/supabase-js";

// createClient throws on an empty URL, which breaks prerendering when the env vars are not set.
// The placeholders let the build finish; requests fail until the real values are provided.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Exporting a singleton client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Or if you prefer keeping your getSupabase function:
export function getSupabase() {
  return supabase;
}