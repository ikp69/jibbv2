import { revalidatePath } from "next/cache";

export const CacheTarget = {
  ANNOUNCEMENTS: ["/[locale]/(cms)/admin/announcements", "/[locale]/(cms)/portal/announcements", "/[locale]/(cms)/portal/dashboard"],
  EVENTS: ["/[locale]/(cms)/admin/events", "/[locale]/(cms)/portal/events", "/[locale]/(cms)/portal/dashboard"],
  TRAINING: ["/[locale]/(cms)/admin/training", "/[locale]/(cms)/portal/training", "/[locale]/(cms)/portal/dashboard"],
  DIRECTORY: ["/[locale]/(cms)/admin/member-directory", "/[locale]/(cms)/portal/member-directory"],
  RESOURCES: ["/[locale]/(cms)/admin/resources", "/[locale]/(cms)/portal/resources", "/[locale]/(cms)/portal/dashboard"],
  BUSINESS_MATCHING: ["/[locale]/(cms)/admin/business-matching", "/[locale]/(cms)/portal/dashboard"],
  COLLABORATIONS: ["/[locale]/(cms)/admin/collaboration", "/[locale]/(cms)/portal/dashboard"],
  SETTINGS: ["/[locale]/(cms)/admin/settings", "/[locale]/(cms)/portal/profile"],
} as const;

/**
 * Safely revalidates Next.js cache routes for CMS pages.
 */
export function revalidateFeatureCache(routes: readonly string[]) {
  routes.forEach((route) => {
    try {
      revalidatePath(route, "page");
    } catch (err) {
      console.warn(`[CACHE_REVALIDATION] Revalidation warning for ${route}:`, err);
    }
  });
}
