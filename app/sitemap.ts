import { MetadataRoute } from "next";
import { getAllSlugs, PostType } from "@/lib/markdown";

const SITE_URL = "https://npo-jibb.org";
const LOCALES = ["en", "ja"] as const;

// Page priority and change frequency configuration
interface PageConfig {
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}

const PAGE_CONFIG: Record<string, PageConfig> = {
  // Homepage & Core Pages
  "/": { priority: 1.0, changeFrequency: "weekly" },

  // Primary Business Pages
  "/about": { priority: 0.95, changeFrequency: "monthly" },
  "/about/leadership": { priority: 0.9, changeFrequency: "monthly" },

  // Services & Sectors
  "/services": { priority: 0.95, changeFrequency: "monthly" },
  "/sectors": { priority: 0.9, changeFrequency: "monthly" },

  // Membership & Operations
  "/membership": { priority: 0.85, changeFrequency: "monthly" },
  "/innovation-hub": { priority: 0.85, changeFrequency: "weekly" },

  // Events & Careers
  "/events": { priority: 0.8, changeFrequency: "weekly" },
  "/careers": { priority: 0.8, changeFrequency: "weekly" },

  // Resources Hub
  "/resources": { priority: 0.8, changeFrequency: "weekly" },
  "/resources/blog": { priority: 0.8, changeFrequency: "weekly" },
  "/resources/insights": { priority: 0.75, changeFrequency: "weekly" },
  "/resources/newsletter": { priority: 0.7, changeFrequency: "weekly" },
  "/resources/thought-leadership": { priority: 0.8, changeFrequency: "monthly" },

  // Contact & Engagement
  "/contact": { priority: 0.75, changeFrequency: "yearly" },

  // Legal & Policy
  "/privacy": { priority: 0.4, changeFrequency: "yearly" },
  "/terms": { priority: 0.4, changeFrequency: "yearly" },
};

// Content type configuration
const CONTENT_CONFIG: Record<PostType, { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = {
  "thought-leadership": {
    path: "thought-leadership",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  blog: {
    path: "blog",
    priority: 0.75,
    changeFrequency: "weekly",
  },
  insights: {
    path: "insights",
    priority: 0.7,
    changeFrequency: "weekly",
  },
};

// Static pages list
const STATIC_PAGES = Object.keys(PAGE_CONFIG);

/**
 * XML Sitemap Generator for JIBB
 *
 * Features:
 * - Hierarchical page organization with semantic prioritization
 * - Optimized crawl budget allocation
 * - Bilingual support (EN/JA) with hreflang alternates
 * - Dynamic content pages (blog, insights, thought-leadership)
 * - Last modified timestamps for recency signals
 * - Proper XML structure for all search engines
 *
 * Complies with XML Sitemap Protocol 0.9
 * Improves SEO crawl efficiency and indexing
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // 1. Homepage (canonical entry with hreflang alternates)
  entries.push({
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}`])
      ),
    },
  });

  // 2. Static pages (all except homepage which is handled above)
  for (const page of STATIC_PAGES.filter((p) => p !== "/")) {
    const config = PAGE_CONFIG[page] || { priority: 0.5, changeFrequency: "monthly" as const };

    entries.push({
      url: `${SITE_URL}/en${page}`,
      lastModified: now,
      changeFrequency: config.changeFrequency,
      priority: config.priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${page}`])
        ),
      },
    });
  }

  // 3. Dynamic content pages (blog, insights, thought-leadership)
  for (const [contentType, config] of Object.entries(CONTENT_CONFIG)) {
    const slugs = await getAllSlugs(contentType as PostType);

    for (const slug of slugs) {
      entries.push({
        url: `${SITE_URL}/en/resources/${config.path}/${slug}`,
        lastModified: now,
        changeFrequency: config.changeFrequency,
        priority: config.priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((locale) => [
              locale,
              `${SITE_URL}/${locale}/resources/${config.path}/${slug}`,
            ])
          ),
        },
      });
    }
  }

  return entries;
}
