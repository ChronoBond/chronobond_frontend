export interface PerformanceConfig {
  enableGzip: boolean;
  enableBrotli: boolean;
  enableCaching: boolean;
  cacheMaxAge: number;
  enablePrefetch: boolean;
  enablePreload: boolean;
}

export const defaultPerformanceConfig: PerformanceConfig = {
  enableGzip: true,
  enableBrotli: true,
  enableCaching: true,
  cacheMaxAge: 31536000,
  enablePrefetch: true,
  enablePreload: true,
};

export const generatePerformanceHints = () => {
  return {
    dnsPrefetch: [
      "//fonts.googleapis.com",
      "//fonts.gstatic.com",
      "//cdnjs.cloudflare.com",
      "//unpkg.com",
    ],

    preconnect: [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://cdnjs.cloudflare.com",
    ],

    preload: [
      {
        href: "/fonts/inter-var.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        href: "/logo.png",
        as: "image",
        type: "image/png",
      },
    ],

    prefetch: [
      "/transactions/mint",
      "/transactions/redeem",
      "/transactions/marketplace",
      "/transactions/holdings",
    ],
  };
};

export const generateCacheHeaders = (
  config: PerformanceConfig = defaultPerformanceConfig
) => {
  const maxAge = config.cacheMaxAge;

  return {
    static: {
      "Cache-Control": `public, max-age=${maxAge}, immutable`,
      Expires: new Date(Date.now() + maxAge * 1000).toUTCString(),
    },

    html: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      ETag: `"${Date.now()}"`,
    },

    api: {
      "Cache-Control": "public, max-age=300, s-maxage=600",
      Vary: "Accept-Encoding",
    },

    json: {
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "Content-Type": "application/json",
    },
  };
};

export const generateCompressionHeaders = (
  config: PerformanceConfig = defaultPerformanceConfig
) => {
  const headers: Record<string, string> = {};

  if (config.enableGzip) {
    headers["Content-Encoding"] = "gzip";
  }

  if (config.enableBrotli) {
    headers["Content-Encoding"] = "br";
  }

  return headers;
};

export const generateSecurityHeaders = () => {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fcl-discovery.onflow.org",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https: wss:",
      "frame-src 'self' https://fcl-discovery.onflow.org https://*.onflow.org https://wallet-v2.blocto.app https://wallet-v2-dev.blocto.app",
    ].join("; "),
  };
};

export const generateRedirects = () => {
  return [
    {
      source: "/old-bonds",
      destination: "/transactions/holdings",
      permanent: true,
    },
  ];
};

export const generateRewrites = () => {
  return [];
};

export const generateRobotsTxt = () => {
  return `
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/

Sitemap: https://chronobond.com/sitemap.xml
Host: https://chronobond.com
`.trim();
};

export const generateSitemapXml = (
  pages: Array<{
    url: string;
    lastmod: string;
    changefreq: string;
    priority: number;
  }>
) => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlset = pages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("");

  return `${xmlHeader}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
};

export const generateManifest = () => {
  return {
    name: "ChronoBond - DeFi Time-Locked Bonds",
    short_name: "ChronoBond",
    description:
      "Mint, trade, and redeem time-locked bonds with guaranteed yields on Flow blockchain",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["finance", "productivity", "utilities"],
    lang: "en",
    orientation: "portrait-primary",
  };
};
