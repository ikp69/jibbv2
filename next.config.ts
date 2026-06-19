import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
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
    // Optimize image formats
    formats: ["image/avif", "image/webp"],
    // Enable JPEG compression
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Cache optimization (1 year for immutable assets)
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  // ============================================================
  // BUILD OPTIMIZATION
  // ============================================================
  // Note: swcMinify is deprecated in Next.js 16+ (enabled by default)
  
  // ============================================================
  // PERFORMANCE & COMPRESSION
  // ============================================================
  compress: true, // Enable gzip compression
  productionBrowserSourceMaps: false, // Reduce bundle size in production
  
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
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },

  // Restrict dev origins — do NOT use wildcard '*' as it opens CORS attack surface
  ...(process.env.NODE_ENV === "development" && {
    allowedDevOrigins: ["localhost:3000"],
  }),
};

export default withNextIntl(nextConfig);