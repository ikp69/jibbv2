import { MetadataRoute } from "next";
import { getAllSlugs, PostType } from "@/lib/markdown";

const SITE_URL = "https://npo-jibb.org";
const LOCALES = ["en", "ja"] as const;

// Static pages that always exist
const STATIC_PAGES = [
  "/",
  "/about",
  "/services",
  "/innovation-hub",
  "/sectors",
  "/membership",
  "/events",
  "/contact",
  "/careers",
  "/privacy",
  "/terms",
  "/resources/blog",
  "/resources/insights",
  "/resources/case-studies",
  "/resources/leadership-thoughts",
];

// Content types with markdown files
const CONTENT_TYPES: PostType[] = [
  "blog",
  "insights",
  "case-studies",
  "leadership-thoughts",
];

// Maps PostType to its URL segment
const TYPE_TO_PATH: Record<PostType, string> = {
  blog: "blog",
  insights: "insights",
  "case-studies": "case-studies",
  "leadership-thoughts": "leadership-thoughts",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // 1. Root redirect (locale-less root)
  entries.push({
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}`])
      ),
    },
  });

  // 2. Static pages — one entry per locale
  for (const page of STATIC_PAGES) {
    entries.push({
      url: `${SITE_URL}/en${page}`,
      lastModified: new Date(),
      changeFrequency: page === "/" ? "weekly" : "monthly",
      priority: page === "/" ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${page}`])
        ),
      },
    });
  }

  // 3. Dynamic content pages — one entry per slug × locale
  for (const type of CONTENT_TYPES) {
    const slugs = await getAllSlugs(type);
    const pathPrefix = TYPE_TO_PATH[type];

    for (const slug of slugs) {
      entries.push({
        url: `${SITE_URL}/en/resources/${pathPrefix}/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((locale) => [
              locale,
              `${SITE_URL}/${locale}/resources/${pathPrefix}/${slug}`,
            ])
          ),
        },
      });
    }
  }

  return entries;
}
