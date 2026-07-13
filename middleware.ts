import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import { getCurrentSessionId } from "@/lib/supabase/auth-guard";
import { SessionService } from "@/lib/services/session-service";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1] || "en";

  // Redirect /ja/* to /en/*
  if (pathname.startsWith("/ja/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ja\//, "/en/");
    return NextResponse.redirect(url, 307);
  }

  // Redirect /innovation-hub and /newsletter to homepage (temporary)
  if (
    pathname.match(/^\/(?:en|ja)?\/?innovation-hub(?:\/.*)?$/) ||
    pathname.match(/^\/(?:en|ja)?\/?(?:resources\/)?newsletter(?:\/.*)?$/)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url, 307);
  }

  // 1. Update/refresh the Supabase session and get the user
  const { supabaseResponse, user, supabase } = await updateSession(request);

  // Check route matches
  const isApiRoute = pathname.startsWith("/api") || pathname.includes("/api/");
  const isLogin = pathname.match(/^\/(en|ja)\/login(\/.*)?$/);
  const isAdminRoute = pathname.match(/^\/(en|ja)\/admin(\/.*)?$/);
  const isPortalRoute = pathname.match(/^\/(en|ja)\/portal(\/.*)?$/);

  // 2. Perform route validation and protection
  if (user) {
    // Extract access token and decode sid claim
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || null;
    const sid = getCurrentSessionId(token);

    if (sid) {
      // Validate session states from database
      const validation = await SessionService.validateSession(user.id, sid);

      if (!validation.valid) {
        // Sign out Supabase auth session
        try {
          await supabase.auth.signOut();
        } catch (e) {}

        if (isApiRoute) {
          return NextResponse.json(
            { error: `Unauthorized: Session invalid. Reason: ${validation.reason}` },
            { status: 401 }
          );
        }

        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/login`;
        url.searchParams.set("reason", validation.reason || "session_expired");
        return NextResponse.redirect(url);
      }

      // Session is valid. Touch the activity timestamp (throttled inside touchSession)
      await SessionService.touchSession(sid);

      const profile = validation.profile;
      const role = profile?.role;
      const country = profile?.country;

      // Handle redirects if visiting login/admin/portal paths
      if (isLogin || isAdminRoute || isPortalRoute) {
        const isFromJapan = country && country.trim().toLowerCase() === "japan";
        const expectedLocale = isFromJapan ? "ja" : "en";
        const currentLocale = locale === "en" || locale === "ja" ? locale : "en";

        // Redirection on Login path
        if (isLogin) {
          const url = request.nextUrl.clone();
          url.pathname = role === "admin" ? `/${expectedLocale}/admin/dashboard` : `/${expectedLocale}/portal/dashboard`;
          return NextResponse.redirect(url);
        }

        // Admin attempting to visit Portal Route (Isolate Admin)
        if (isPortalRoute && role === "admin") {
          const url = request.nextUrl.clone();
          url.pathname = `/${expectedLocale}/admin/dashboard`;
          return NextResponse.redirect(url);
        }

        // Member attempting to visit Admin Route
        if (isAdminRoute && role !== "admin") {
          const url = request.nextUrl.clone();
          url.pathname = `/${expectedLocale}/portal/dashboard`;
          return NextResponse.redirect(url);
        }

        // Redirect user to the correct locale path if they are on the wrong one
        if (currentLocale !== expectedLocale) {
          const url = request.nextUrl.clone();
          url.pathname = pathname.replace(/^\/(en|ja)/, `/${expectedLocale}`);
          return NextResponse.redirect(url);
        }
      }
    } else {
      // Missing Session ID trigger
      try {
        await supabase.auth.signOut();
      } catch (e) {}

      if (isApiRoute) {
        return NextResponse.json({ error: "Unauthorized: Missing session context." }, { status: 401 });
      }

      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set("reason", "invalid_session");
      return NextResponse.redirect(url);
    }
  } else {
    // If no user context exists and trying to access protected paths or APIs
    if (isAdminRoute || isPortalRoute) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }

    if (isApiRoute) {
      // Allow general public endpoints (if any) or block private ones
      const isPublicApi = pathname.includes("/public/");
      if (!isPublicApi) {
        return NextResponse.json({ error: "Unauthorized: Access token missing." }, { status: 401 });
      }
    }
  }

  // 3. Process localization routing
  const response = handleI18nRouting(request);

  // 4. Copy cookie updates from Supabase token refresh into final localized response
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

  return response;
}

export const config = {
  // Match all pathnames including APIs except for Next.js internal structures and static assets
  matcher: ["/", "/(en|ja)/:path*", "/((?!_next|.*\\..*).*)"],
};
