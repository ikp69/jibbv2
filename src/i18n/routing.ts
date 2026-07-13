import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All locales that are supported
  locales: ["en", "ja"],

  // Default locale when no locale prefix is found
  defaultLocale: "en",

  // Always show the locale prefix in the URL (e.g., /en/about, /ja/about)
  localePrefix: "always",
});
