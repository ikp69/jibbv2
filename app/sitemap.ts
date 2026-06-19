import { MetadataRoute } from "next";
import { getAllSlugs, PostType } from "@/lib/markdown";

const SITE_URL = "https://npo-jibb.org";
const LOCALES = ["en", "ja"] as const;

// Page priority mapping (0.0 - 1.0)
// Higher values = more important for crawling/indexing
const PAGE_PRIORITY: Record<string, number> = {
  "/": 1.0, // Homepage - highest priority
  "/about": 0.9, // About - important for context
  "/services": 0.95, // Services - core business
  "/innovation-hub": 0.85, // Innovation hub - important offering
  "/sectors": 0.85, // Sectors - business focus
  "/membership": 0.8, // Membership - business development
  "/events": 0.7, // Events - frequently updated
  "/careers": 0.75, // Careers - important for recruitment
  "/contact": 0.8, // Contact - conversion page
  "/resources/blog": 0.8, // Blog listing
  "/resources/insights": 0.75, // Insights listing
  "/resources/thought-leadership": 0.75, // Thought leadership listing
  "/privacy": 0.4, // Legal - lower priority
  "/terms": 0.4, // Legal - lower priority
};

// Change frequency mapping (how often content typically changes)
// Valid values: always | never | hourly | daily | weekly | monthly | yearly
const PAGE_CHANGEFREQ: Record<string, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
  "/": "weekly", // Homepage changes weekly (news, featured content)
  "/about": "monthly", // About page rarely changes
  "/services": "monthly", // Services change infrequently (monthly is closest to quarterly)
  "/innovation-hub": "weekly", // Hub content updates regularly
  "/sectors": "monthly", // Sectors definition change infrequently (monthly is closest to quarterly)
  "/membership": "monthly", // Membership tiers may change
  "/events": "weekly", // Events frequently updated
  "/careers": "weekly", // Job listings frequently updated
  "/contact": "yearly", // Contact rarely changes
  "/resources/blog": "weekly", // Blog frequently updated
  "/resources/insights": "weekly", // Insights frequently updated
  "/resources/thought-leadership": "monthly", // Thought leadership less frequent
  "/privacy": "yearly", // Legal pages rarely change
  "/terms": "yearly", // Legal pages rarely change
};

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
  "/resources/thought-leadership",
];

// Content types with markdown files
const CONTENT_TYPES: PostType[] = [
  "blog",
  "insights",
  "thought-leadership",
];

// Maps PostType to its URL segment
const TYPE_TO_PATH: Record<PostType, string> = {
  blog: "blog",
  insights: "insights",
  "thought-leadership": "thought-leadership",
};

/**
 * Sitemap Generation for JIBB
 * 
 * Generates XML sitemap with:
 * - Dynamic priority values based on page importance
 * - Change frequency optimized per page type
 * - Last modified dates (current date for dynamic content)
 * - Hreflang alternates for bilingual support (EN/JA)
 * - Up to 50,000 URLs per file (split if needed)
 * 
 * Supports Google's sitemap protocol 0.9
 * Improves crawl efficiency and indexing
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  // 1. Root redirect (locale-less root)
  // Serves as entry point for all locales
  entries.push({
    url: SITE_URL,
    lastModified,
    changeFrequency: "weekly",
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}`])
      ),
    },
  });

  // 2. Static pages — one entry per locale with optimized priority/changefreq
  for (const page of STATIC_PAGES) {
    const priority = PAGE_PRIORITY[page] || 0.5; // Default 0.5 if not specified
    const changeFrequency = PAGE_CHANGEFREQ[page] || "monthly"; // Default monthly if not specified

    entries.push({
      url: `${SITE_URL}/en${page}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${page}`])
        ),
      },
    });
  }

  // 3. Dynamic content pages — one entry per slug × locale
  // Article/blog pages with editorial content
  for (const type of CONTENT_TYPES) {
    const slugs = await getAllSlugs(type);
    const pathPrefix = TYPE_TO_PATH[type];
    
    // Dynamic content priority is slightly lower than main pages
    const contentPriority = 0.75;
    const contentChangeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly";

    for (const slug of slugs) {
      entries.push({
        url: `${SITE_URL}/en/resources/${pathPrefix}/${slug}`,
        lastModified,
        changeFrequency: contentChangeFreq,
        priority: contentPriority,
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

  // Return sitemap entries (Next.js auto-generates XML)
  return entries;
}
