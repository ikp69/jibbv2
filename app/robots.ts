import { MetadataRoute } from "next";

const SITE_URL = "https://npo-jibb.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Disallow search result pages (they have dynamic ?q= params)
        disallow: [
          "/api/",
          "*/resources/blog?*",
          "*/resources/insights?*",
          "*/resources/case-studies?*",
          "*/resources/thought-leadership?*",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
