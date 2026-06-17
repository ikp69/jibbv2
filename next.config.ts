import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Restrict dev origins — do NOT use wildcard '*' as it opens CORS attack surface
  ...(process.env.NODE_ENV === "development" && {
    allowedDevOrigins: ["localhost:3000"],
  }),
};

export default withNextIntl(nextConfig);