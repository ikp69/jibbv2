import { createBrowserClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let cachedBrowserClient: SupabaseClient | null = null;

/**
 * Creates or returns the singleton Supabase browser client for client-side components.
 * 
 * Uses @supabase/ssr createBrowserClient to handle authentication cookies in the browser.
 */
export function createClient(): SupabaseClient {
  if (cachedBrowserClient) {
    return cachedBrowserClient;
  }

  cachedBrowserClient = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return cachedBrowserClient;
}
