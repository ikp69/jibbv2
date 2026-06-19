/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compression settings
  compress: true,
  
  // Generate ETags for caching
  generateEtags: true,
  
  // PoweredBy header for security
  poweredByHeader: false,
  
  // Optimize for production
  productionBrowserSourceMaps: false,
  
  // Font optimization
  optimizeFonts: true,
  
  // Headers for proper encoding
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Encoding',
            value: 'gzip',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Webpack config for optimization
  webpack: (config, { isServer }) => {
    config.optimization.minimize = true;
    return config;
  },

  // Internationalization
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Strict mode for development
  reactStrictMode: true,

  // SWR stale-while-revalidate for incremental static regeneration
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  // Disable static optimization for now (can be enabled later)
  staticOptimization: true,

  // Enable experimental features if needed
  experimental: {
    // Optimize package imports for smaller bundle size
    optimizePackageImports: [
      '@heroicons/react/24/solid',
      'lucide-react',
      'framer-motion',
    ],
  },
};

module.exports = nextConfig;
