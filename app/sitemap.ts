import { MetadataRoute } from "next";
import { getAllSlugs, PostType, getPostBySlug } from "@/lib/markdown";
import fs from "fs/promises";
import path from "path";

const SITE_URL = "https://npo-jibb.org";
const CONTENT_DIRECTORY = path.join(process.cwd(), "content");

interface PageConfig {
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}

const PAGE_CONFIG: Record<string, PageConfig> = {
  "/": { priority: 1.0, changeFrequency: "weekly" },
  "/about": { priority: 0.9, changeFrequency: "monthly" },
  "/about/leadership": { priority: 0.9, changeFrequency: "monthly" },
  "/services": { priority: 0.9, changeFrequency: "monthly" },
  "/sectors": { priority: 0.9, changeFrequency: "monthly" },
  "/membership": { priority: 0.9, changeFrequency: "monthly" },
  "/innovation-hub": { priority: 0.9, changeFrequency: "weekly" },
  "/events": { priority: 0.8, changeFrequency: "weekly" },
  "/careers": { priority: 0.9, changeFrequency: "weekly" },
  "/resources": { priority: 0.8, changeFrequency: "weekly" },
  "/resources/blog": { priority: 0.8, changeFrequency: "weekly" },
  "/resources/insights": { priority: 0.8, changeFrequency: "weekly" },
  "/resources/newsletter": { priority: 0.8, changeFrequency: "weekly" },
  "/resources/thought-leadership": { priority: 0.8, changeFrequency: "monthly" },
  "/contact": { priority: 0.9, changeFrequency: "yearly" },
  "/privacy": { priority: 0.4, changeFrequency: "yearly" },
  "/terms": { priority: 0.4, changeFrequency: "yearly" },
};

const CONTENT_CONFIG: Record<PostType, { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = {
  "thought-leadership": {
    path: "thought-leadership",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  blog: {
    path: "blog",
    priority: 0.7,
    changeFrequency: "weekly",
  },
  insights: {
    path: "insights",
    priority: 0.7,
    changeFrequency: "weekly",
  },
};

const STATIC_PAGES = Object.keys(PAGE_CONFIG);

async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // 1. Homepage
  entries.push({
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        ja: `${SITE_URL}/ja`,
        "x-default": `${SITE_URL}/en`,
      },
    },
  });

  // 2. Static pages
  for (const page of STATIC_PAGES.filter((p) => p !== "/")) {
    const config = PAGE_CONFIG[page] || { priority: 0.5, changeFrequency: "monthly" as const };

    entries.push({
      url: `${SITE_URL}/en${page}`,
      lastModified: now,
      changeFrequency: config.changeFrequency,
      priority: config.priority,
      alternates: {
        languages: {
          en: `${SITE_URL}/en${page}`,
          ja: `${SITE_URL}/ja${page}`,
          "x-default": `${SITE_URL}/en${page}`,
        },
      },
    });
  }

  // 3. Dynamic content pages
  for (const [contentType, config] of Object.entries(CONTENT_CONFIG)) {
    const slugs = await getAllSlugs(contentType as PostType);

    for (const slug of slugs) {
      const post = await getPostBySlug(contentType as PostType, slug, "en");
      let lastModified = now;
      if (post && (post.updatedAt || post.date)) {
        const parsedDate = new Date(post.updatedAt || post.date);
        if (!isNaN(parsedDate.getTime())) {
          lastModified = parsedDate;
        }
      }

      const enPath = path.join(CONTENT_DIRECTORY, contentType, "en", `${slug}.md`);
      const jaPath = path.join(CONTENT_DIRECTORY, contentType, "ja", `${slug}.md`);
      const hasEn = await checkFileExists(enPath);
      const hasJa = await checkFileExists(jaPath);

      const languages: Record<string, string> = {};
      if (hasEn) {
        languages.en = `${SITE_URL}/en/resources/${config.path}/${slug}`;
      }
      if (hasJa) {
        languages.ja = `${SITE_URL}/ja/resources/${config.path}/${slug}`;
      }
      if (hasEn) {
        languages["x-default"] = `${SITE_URL}/en/resources/${config.path}/${slug}`;
      } else if (hasJa) {
        languages["x-default"] = `${SITE_URL}/ja/resources/${config.path}/${slug}`;
      }

      const primaryLocale = hasEn ? "en" : (hasJa ? "ja" : "en");

      entries.push({
        url: `${SITE_URL}/${primaryLocale}/resources/${config.path}/${slug}`,
        lastModified,
        changeFrequency: config.changeFrequency,
        priority: config.priority,
        alternates: {
          languages,
        },
      });
    }
  }

  return entries;
}
