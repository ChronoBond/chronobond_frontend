// Performance and SEO optimization utilities

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
  cacheMaxAge: 31536000, // 1 year
  enablePrefetch: true,
  enablePreload: true,
};

// Generate performance hints for Next.js
export const generatePerformanceHints = () => {
  return {
    // DNS prefetch for external domains
    dnsPrefetch: [
      "//fonts.googleapis.com",
      "//fonts.gstatic.com",
      "//cdnjs.cloudflare.com",
      "//unpkg.com",
    ],
    
    // Preconnect to important origins
    preconnect: [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://cdnjs.cloudflare.com",
    ],
    
    // Preload critical resources
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
    
    // Prefetch important pages
    prefetch: [
      "/transactions/mint",
      "/transactions/redeem", 
      "/transactions/marketplace",
      "/transactions/holdings",
    ],
  };
};

// Generate cache headers for different resource types
export const generateCacheHeaders = (config: PerformanceConfig = defaultPerformanceConfig) => {
  const maxAge = config.cacheMaxAge;
  
  return {
    // Static assets (images, fonts, etc.)
    static: {
      "Cache-Control": `public, max-age=${maxAge}, immutable`,
      "Expires": new Date(Date.now() + maxAge * 1000).toUTCString(),
    },
    
    // HTML pages
    html: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "ETag": `"${Date.now()}"`,
    },
    
    // API responses
    api: {
      "Cache-Control": "public, max-age=300, s-maxage=600", // 5 min browser, 10 min CDN
      "Vary": "Accept-Encoding",
    },
    
    // JSON data
    json: {
      "Cache-Control": "public, max-age=60, s-maxage=300", // 1 min browser, 5 min CDN
      "Content-Type": "application/json",
    },
  };
};

// Generate compression headers
export const generateCompressionHeaders = (config: PerformanceConfig = defaultPerformanceConfig) => {
  const headers: Record<string, string> = {};
  
  if (config.enableGzip) {
    headers["Content-Encoding"] = "gzip";
  }
  
  if (config.enableBrotli) {
    headers["Content-Encoding"] = "br";
  }
  
  return headers;
};

// Generate security headers for SEO and security
export const generateSecurityHeaders = () => {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https:",
      "frame-src 'none'",
    ].join("; "),
  };
};

// Generate SEO-friendly redirects
export const generateRedirects = () => {
  return [
    // Redirect www to non-www
    {
      source: "/(.*)",
      has: [
        {
          type: "host",
          value: "www.chronobond.com",
        },
      ],
      destination: "https://chronobond.com/:path*",
      permanent: true,
    },
    
    // Redirect trailing slash
    {
      source: "/(.*)/",
      destination: "/$1",
      permanent: true,
    },
    
    // Redirect old URLs
    {
      source: "/old-bonds",
      destination: "/transactions/holdings",
      permanent: true,
    },
    
    // Redirect API endpoints
    {
      source: "/api/bonds",
      destination: "/api/v1/bonds",
      permanent: true,
    },
  ];
};

// Generate rewrites for SEO
export const generateRewrites = () => {
  return [
    // Rewrite for clean URLs
    {
      source: "/bonds/:path*",
      destination: "/transactions/holdings/:path*",
    },
    
    // Rewrite for API versioning
    {
      source: "/api/:path*",
      destination: "/api/v1/:path*",
    },
  ];
};

// Generate robots.txt content
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

// Generate sitemap.xml content
export const generateSitemapXml = (pages: Array<{ url: string; lastmod: string; changefreq: string; priority: number }>) => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlset = pages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');
  
  return `${xmlHeader}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
};

// Generate manifest.json for PWA
export const generateManifest = () => {
  return {
    name: "ChronoBond - DeFi Time-Locked Bonds",
    short_name: "ChronoBond",
    description: "Mint, trade, and redeem time-locked bonds with guaranteed yields on Flow blockchain",
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
