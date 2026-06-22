import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All locales that are supported
  // TEMPORARILY: Only English enabled - Japanese translations being verified
  locales: ["en"],

  // Default locale when no locale prefix is found
  defaultLocale: "en",

  // Always show the locale prefix in the URL (e.g., /en/about, /ja/about)
  localePrefix: "always",
});
