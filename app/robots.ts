import { MetadataRoute } from "next";

const SITE_URL = "https://npo-jibb.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // API routes — never index
          "/api/",
          // Auth pages — no value in indexing login/register flows
          "/en/auth/",
          "/ja/auth/",
          // Member dashboard — private, authenticated content
          "/en/dashboard/",
          "/ja/dashboard/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
