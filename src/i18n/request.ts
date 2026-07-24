import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment (touch to reload messages)
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    timeZone: "Asia/Kolkata",
    messages: {
      ...(await import(`../../messages/${locale}/layout.json`)).default,
      ...(await import(`../../messages/${locale}/home.json`)).default,
      ...(await import(`../../messages/${locale}/about.json`)).default,
      ...(await import(`../../messages/${locale}/services.json`)).default,
      ...(await import(`../../messages/${locale}/membership.json`)).default,
      ...(await import(`../../messages/${locale}/hub.json`)).default,
      ...(await import(`../../messages/${locale}/innovationHub.json`)).default,
      ...(await import(`../../messages/${locale}/terms.json`)).default,
      ...(await import(`../../messages/${locale}/contact.json`)).default,
      ...(await import(`../../messages/${locale}/notFound.json`)).default,
      ...(await import(`../../messages/${locale}/auth.json`)).default,
      ...(await import(`../../messages/${locale}/newsletter.json`)).default,
    },
  };
});
