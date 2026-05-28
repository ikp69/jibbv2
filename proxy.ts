import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - API routes (/api/...)
  // - Next.js internals (/_next/...)
  // - Static files (files with extensions like .ico, .png, .svg, etc.)
  matcher: ["/", "/(en|ja)/:path*", "/((?!api|_next|.*\\..*).*)"],
};
