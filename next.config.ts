import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Enable image optimization for external sources if needed
  images: {
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);
