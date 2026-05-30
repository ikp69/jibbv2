import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match the root
    "/",
    // Match all localized pathnames
    "/(ja|en)/:path*",
    // Enable redirection for unlocalized paths except public/static assets or API routes
    "/((?!api|_next|_vercel|.*\\..*).*)"
  ],
};
