import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let cachedAdminClient: SupabaseClient | null = null;

/**
 * Creates or retrieves the singleton Supabase Service Role admin client.
 *
 * CRITICAL SECURITY NOTICE:
 * This client uses SUPABASE_SERVICE_ROLE_KEY and completely bypasses Postgres Row Level Security (RLS).
 * MUST only be invoked from secure Server Components, Server Actions, or Node server endpoints.
 * Includes a runtime check to prevent execution on the browser client.
 */
export function createAdminClient(): SupabaseClient {
  // Runtime guard preventing bundling or invocation in browser environment
  if (typeof window !== "undefined") {
    throw new Error(
      "[SECURITY_ALERT] Attempted to instantiate Supabase Admin Service Role client on client-side browser execution context!"
    );
  }

  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  cachedAdminClient = createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedAdminClient;
}
