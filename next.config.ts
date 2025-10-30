import type { NextConfig } from "next";
import {
  generateRedirects,
  generateRewrites,
  generateSecurityHeaders,
} from "./src/lib/performance-seo";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...Object.entries(generateSecurityHeaders()).map(([key, value]) => ({
            key,
            value,
          })),
          {
            key: "X-Robots-Tag",
            value:
              "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
        ],
      },
    ];
  },
  async redirects() {
    return generateRedirects();
  },
  async rewrites() {
    return generateRewrites();
  },
  reactStrictMode: true,
  // eslint: {
  //   ignoreDuringBuilds: false,
  // },
  // typescript: {
  //   ignoreBuildErrors: false,
  // },
  // trailingSlash: false,
};

export default nextConfig;
