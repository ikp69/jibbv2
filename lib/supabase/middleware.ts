import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { type SupabaseClient, type User } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export interface UpdateSessionResult {
  supabaseResponse: NextResponse;
  user: User | null;
  supabase?: SupabaseClient;
}

/**
 * Refreshes the active Supabase authentication session and synchronizes auth cookies
 * between incoming request and outgoing response objects in Next.js Middleware.
 */
export async function updateSession(request: NextRequest): Promise<UpdateSessionResult> {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const allCookies = request.cookies.getAll();
          const seen = new Set<string>();
          return allCookies.filter((c) => {
            if (seen.has(c.name)) return false;
            seen.add(c.name);
            return true;
          });
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              httpOnly: options?.httpOnly ?? true,
              secure: options?.secure ?? env.NODE_ENV === "production",
              sameSite: options?.sameSite ?? "lax",
              path: options?.path ?? "/",
            })
          );
        },
      },
    }
  );

  let user: User | null = null;
  try {
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  } catch (error) {
    if (error instanceof Error) {
      console.warn("[SUPABASE_MIDDLEWARE] Auth session refresh non-fatal warning:", error.message);
    }
  }

  return { supabaseResponse, user, supabase };
}
