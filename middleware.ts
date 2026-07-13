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
    // Retrieve role, status, and country from profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role, status, country")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    const status = profile?.status;
    const country = profile?.country;

    if (process.env.NODE_ENV === "development") {
      console.log("MIDDLEWARE CHECK:", { userId: user.id, role, status, country, error });
    }

    // Reject inactive users
    if (status !== "active") {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      // Try signing out
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Ignored in middleware
      }
      return NextResponse.redirect(url);
    }

    // Reject unknown roles
    if (role !== "admin" && role !== "member") {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Ignored in middleware
      }
      return NextResponse.redirect(url);
    }

    // Determine expected locale based on country
    const isFromJapan = country && country.trim().toLowerCase() === "japan";
    const expectedLocale = isFromJapan ? "ja" : "en";
    const currentLocale = locale === "en" || locale === "ja" ? locale : "en";

    // Handle Login redirection
    if (isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = role === "admin" ? `/${expectedLocale}/admin/dashboard` : `/${expectedLocale}/portal/dashboard`;
      return NextResponse.redirect(url);
    }

    // Handle Admin attempting to visit Portal Route (Isolate Admin)
    if (isPortalRoute && role === "admin") {
      const url = request.nextUrl.clone();
      url.pathname = `/${expectedLocale}/admin/dashboard`;
      return NextResponse.redirect(url);
    }

    // Handle Member attempting to visit Admin Route
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
  // Match all pathnames except for Next.js internal structures, static files, and API routes
  matcher: ["/", "/(en|ja)/:path*", "/((?!api|_next|.*\\..*).*)"],
};
