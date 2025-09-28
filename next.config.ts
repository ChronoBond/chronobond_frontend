import type { NextConfig } from "next";
import { generateRedirects, generateRewrites, generateSecurityHeaders } from "./src/lib/performance-seo";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@onflow/kit'],
  },

  // Turbopack configuration (moved from experimental)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

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

  // Headers for SEO and security
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
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600',
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

  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            enforce: true,
          },
        },
      };
    }

    // SVG optimization with proper loader
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

  // Output optimization
  output: 'standalone',

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

  // Environment variables (if needed)
  // env: {
  //   CUSTOM_KEY: process.env.CUSTOM_KEY,
  // },

  // Trailing slash configuration
  trailingSlash: false,

  // Base path (if deploying to subdirectory)
  // basePath: '/chronobond',

  // Asset prefix (if using CDN)
  // assetPrefix: 'https://cdn.chronobond.com',
};

export default nextConfig;
