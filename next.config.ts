import type { NextConfig } from "next";
import { generateRedirects, generateRewrites, generateSecurityHeaders } from "./src/lib/performance-seo";

const nextConfig: NextConfig = {

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // Headers for SEO and security (centralized via generator)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...Object.entries(generateSecurityHeaders()).map(([key, value]) => ({
            key,
            value,
          })),
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return generateRedirects();
  },

  // Rewrites for clean URLs
  async rewrites() {
    return generateRewrites();
  },

  // Webpack customization (only what's needed)
  webpack: (config, { dev, isServer }) => {
    // SVG as React components via SVGR
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
          },
        },
      ],
    });

    return config;
  },

  // Enable React strict mode
  reactStrictMode: true,

  // Enable ESLint during builds
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Enable TypeScript type checking
  typescript: {
    ignoreBuildErrors: false,
  },

  // Trailing slash configuration
  trailingSlash: false,

  // Base path (if deploying to subdirectory)
  // basePath: '/chronobond',

};

export default nextConfig;
