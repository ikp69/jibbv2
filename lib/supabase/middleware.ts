import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Middleware runs on every request, so we gracefully skip auth checks
  // when Supabase is not configured (local dev without .env.local).
  // Server actions and page components use a fail-fast client instead.
  const isConfigured = Boolean(url && key);

  if (!isConfigured) {
    return { supabaseResponse, user: null };
  }

  const supabase = createServerClient(
    url!,
    key!,
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
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  } catch (error) {
    // Session refresh failure is non-fatal in middleware — the page-level
    // auth guard (dashboard/layout.tsx) will redirect if the session is invalid.
    // Network errors during middleware are expected in edge environments and can be ignored.
    if (error instanceof Error) {
      if (process.env.NODE_ENV === "development") {
        console.debug("Middleware auth check skipped:", error.message);
      }
    }
  }

  return { supabaseResponse, user, supabase };
}
