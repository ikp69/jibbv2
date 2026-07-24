import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Creates an authenticated Supabase server client bound to the current Next.js HTTP cookie context.
 * Uses validated environment parameters via @/lib/env.
 */
export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const allCookies = cookieStore.getAll();
          const seen = new Set<string>();
          return allCookies.filter((c) => {
            if (seen.has(c.name)) return false;
            seen.add(c.name);
            return true;
          });
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                httpOnly: options?.httpOnly ?? true,
                secure: options?.secure ?? env.NODE_ENV === "production",
                sameSite: options?.sameSite ?? "lax",
                path: options?.path ?? "/",
              })
            );
          } catch (err) {
            // Invoked from Server Component rendering context where cookie mutation is restricted.
            // Ignored as Next.js Edge Middleware handles cookie refresh synchronization.
          }
        },
      },
    }
  );
}
