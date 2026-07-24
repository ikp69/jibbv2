import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // ============================================================
  // LEGACY & ALIAS REDIRECTS (Task-06)
  // ============================================================
  async redirects() {
    return [
      {
        source: "/:locale(en|ja)?/innovation-hub/:path*",
        destination: "/:locale",
        permanent: false,
      },
      {
        source: "/:locale(en|ja)?/resources/newsletter/:path*",
        destination: "/:locale",
        permanent: false,
      },
      {
        source: "/:locale(en|ja)?/newsletter/:path*",
        destination: "/:locale",
        permanent: false,
      },
    ];
  },

  // ============================================================
  // IMAGE OPTIMIZATION
  // ============================================================
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  // ============================================================
  // PERFORMANCE & COMPRESSION
  // ============================================================
  compress: true,
  productionBrowserSourceMaps: false,
  
  // ============================================================
  // HEADERS FOR CACHING & COMPRESSION
  // ============================================================
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=10, stale-while-revalidate=59",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: true,

  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },

  ...(process.env.NODE_ENV === "development" && {
    allowedDevOrigins: ["localhost:3000"],
  }),
};

export default withNextIntl(nextConfig);