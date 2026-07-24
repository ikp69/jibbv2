import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import { getCurrentSessionId } from "@/lib/supabase/auth-guard";
import { SessionService } from "@/lib/services/session-service";

const handleI18nRouting = createMiddleware(routing);

/**
 * Root Edge Middleware handling internationalization routing, legacy redirects,
 * session authentication validation, role-based path protection, and security headers.
 */
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1] || "en";

  // 1. Legacy locale redirect (/ja/* to /en/*)
  if (pathname.startsWith("/ja/") && !pathname.includes("/admin/") && !pathname.includes("/portal/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ja\//, "/en/");
    return NextResponse.redirect(url, 307);
  }

  // 2. Refresh active session context via Supabase SSR client
  const { supabaseResponse, user, supabase } = await updateSession(request);

  const isApiRoute = pathname.startsWith("/api") || pathname.includes("/api/");
  const isLogin = pathname.match(/^\/(en|ja)\/login(\/.*)?$/);
  const isAdminRoute = pathname.match(/^\/(en|ja)\/admin(\/.*)?$/);
  const isPortalRoute = pathname.match(/^\/(en|ja)\/portal(\/.*)?$/);

  // 3. Route Validation & Session State Enforcement
  if (user && supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || null;
    const sid = getCurrentSessionId(token);

    if (sid) {
      // Validate session against memory cache / PostgreSQL
      const validation = await SessionService.validateSession(user.id, sid);

      if (!validation.valid) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn("[MIDDLEWARE] Sign out exception during session invalidation:", e);
        }

        if (isApiRoute) {
          return NextResponse.json(
            { error: "Unauthorized: Session is invalid or revoked." },
            { status: 401 }
          );
        }

        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/login`;
        url.searchParams.set("reason", validation.reason || "session_expired");
        return NextResponse.redirect(url);
      }

      // Non-blocking background touch of session activity timestamp
      SessionService.touchSession(sid).catch(() => {});

      const profile = validation.profile;
      const role = profile?.role;
      const country = profile?.country;

      if (isLogin || isAdminRoute || isPortalRoute) {
        const isFromJapan = country && country.trim().toLowerCase() === "japan";
        const expectedLocale = isFromJapan ? "ja" : "en";
        const currentLocale = locale === "en" || locale === "ja" ? locale : "en";

        if (isLogin) {
          const url = request.nextUrl.clone();
          url.pathname = role === "admin" ? `/${expectedLocale}/admin/dashboard` : `/${expectedLocale}/portal/dashboard`;
          return NextResponse.redirect(url);
        }

        if (isPortalRoute && role === "admin") {
          const url = request.nextUrl.clone();
          url.pathname = `/${expectedLocale}/admin/dashboard`;
          return NextResponse.redirect(url);
        }

        if (isAdminRoute && role !== "admin") {
          const url = request.nextUrl.clone();
          url.pathname = `/${expectedLocale}/portal/dashboard`;
          return NextResponse.redirect(url);
        }

        if (currentLocale !== expectedLocale) {
          const url = request.nextUrl.clone();
          url.pathname = pathname.replace(/^\/(en|ja)/, `/${expectedLocale}`);
          return NextResponse.redirect(url);
        }
      }
    } else {
      if (supabase) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn("[MIDDLEWARE] Sign out exception during missing sid cleanup:", e);
        }
      }

      if (isApiRoute) {
        return NextResponse.json({ error: "Unauthorized: Missing session context." }, { status: 401 });
      }

      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set("reason", "invalid_session");
      return NextResponse.redirect(url);
    }
  } else {
    // Unauthenticated access control
    if (isAdminRoute || isPortalRoute) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }

    if (isApiRoute) {
      const isPublicApi = pathname.includes("/public/");
      if (!isPublicApi) {
        return NextResponse.json({ error: "Unauthorized: Access token missing." }, { status: 401 });
      }
    }
  }

  // 4. Internationalization Routing Execution
  let response: NextResponse;
  if (isApiRoute) {
    response = NextResponse.next();
  } else {
    response = handleI18nRouting(request);
  }

  // 5. Synchronize Mutated Auth Cookies onto Final Response
  if (supabaseResponse) {
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.delete(cookie.name);
      response.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        domain: cookie.domain,
        maxAge: cookie.maxAge,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
        expires: cookie.expires,
        httpOnly: cookie.httpOnly,
      });
    });
  }

  // 6. Security Headers Injection
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: ["/", "/(en|ja)/:path*", "/api/:path*", "/((?!_next|.*\\..*).*)"],
};
