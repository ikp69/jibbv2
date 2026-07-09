import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1] || "en";

  // Redirect /innovation-hub and /newsletter / /resources/newsletter to homepage (temporary)
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

  // TEMPORARY: Redirect /ja routes to /en (Japanese translations being verified)
  if (pathname.startsWith("/ja")) {
    const enPath = pathname.replace(/^\/ja/, "/en");
    const url = request.nextUrl.clone();
    url.pathname = enPath;
    return NextResponse.redirect(url);
  }

  // Check routes
  const isLogin = pathname.match(/^\/(en|ja)\/login(\/.*)?$/);
  const isAdminRoute = pathname.match(/^\/(en|ja)\/admin(\/.*)?$/);
  const isPortalRoute = pathname.match(/^\/(en|ja)\/portal(\/.*)?$/);

  // 2. Perform route protection / redirects
  if ((isAdminRoute || isPortalRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  if (user && (isLogin || isAdminRoute || isPortalRoute)) {
    // Retrieve role from profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    console.log("MIDDLEWARE CHECK:", { userId: user.id, role, error });

    if (isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = role === "admin" ? `/${locale}/admin/dashboard` : `/${locale}/portal/dashboard`;
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && role !== "admin") {
      // Forbidden: Redirect normal members to their portal dashboard instead of 403 to avoid exposing admin route
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/portal/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // 3. Process localization routing
  const response = handleI18nRouting(request);

  // 4. Copy cookie updates from Supabase token refresh into final localized response
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

  return response;
}

export const config = {
  // Match all pathnames except for Next.js internal structures, static files, and API routes
  matcher: ["/", "/(en|ja)/:path*", "/((?!api|_next|.*\\..*).*)"],
};
