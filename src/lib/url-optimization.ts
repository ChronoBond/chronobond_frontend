// URL optimization utilities for SEO

export interface SEOUrlConfig {
  baseUrl: string;
  protocol: "https" | "http";
  www: boolean;
  trailingSlash: boolean;
}

export const defaultSEOConfig: SEOUrlConfig = {
  baseUrl: "chronobond.com",
  protocol: "https",
  www: false,
  trailingSlash: false,
};

// Generate SEO-friendly URLs
export const generateSEOUrl = (
  path: string,
  config: SEOUrlConfig = defaultSEOConfig
): string => {
  const protocol = config.protocol;
  const www = config.www ? "www." : "";
  const baseUrl = config.baseUrl;
  const trailingSlash = config.trailingSlash ? "/" : "";
  
  // Clean path
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const finalPath = config.trailingSlash && !cleanPath.endsWith("/") 
    ? `${cleanPath}/` 
    : cleanPath;
  
  return `${protocol}://${www}${baseUrl}${finalPath}`;
};

// Generate canonical URLs
export const generateCanonicalUrl = (path: string): string => {
  return generateSEOUrl(path, {
    ...defaultSEOConfig,
    www: false,
    trailingSlash: false,
  });
};

// Generate breadcrumb URLs
export const generateBreadcrumbUrls = (paths: string[]): string[] => {
  return paths.map((_, index) => {
    const currentPath = paths.slice(0, index + 1).join("/");
    return generateCanonicalUrl(currentPath);
  });
};

// URL slug generation for SEO
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

// Generate SEO-friendly page titles
export const generatePageTitle = (
  pageName: string,
  siteName: string = "ChronoBond",
  separator: string = " | "
): string => {
  return `${pageName}${separator}${siteName}`;
};

// Generate meta descriptions
export const generateMetaDescription = (
  action: string,
  context: string,
  benefits: string[] = []
): string => {
  const baseDescription = `${action} ${context} on ChronoBond DeFi platform`;
  const benefitsText = benefits.length > 0 
    ? `. ${benefits.join(", ")}` 
    : "";
  
  return `${baseDescription}${benefitsText}. Secure, decentralized, and automated yield generation on Flow blockchain.`;
};

// Common page configurations
export const pageConfigs = {
  home: {
    title: "ChronoBond - DeFi Time-Locked Bonds on Flow Blockchain",
    description: "Mint, trade, and redeem time-locked bonds with guaranteed yields. Secure DeFi investment platform with automated yield generation on Flow blockchain.",
    keywords: ["DeFi", "time-locked bonds", "Flow blockchain", "yield farming", "bond trading"],
    path: "/",
  },
  mint: {
    title: "Mint Bonds - Create Time-Locked Bonds",
    description: "Create and mint time-locked bonds with guaranteed yields. Choose from multiple yield strategies and lock-up periods.",
    keywords: ["mint bonds", "create bonds", "yield strategies", "bond creation"],
    path: "/transactions/mint",
  },
  redeem: {
    title: "Redeem Bonds - Claim Your Matured Bonds", 
    description: "Redeem your matured time-locked bonds and claim your principal plus yield. Track bond maturity and manage your portfolio.",
    keywords: ["redeem bonds", "claim bonds", "bond redemption", "matured bonds"],
    path: "/transactions/redeem",
  },
  marketplace: {
    title: "Bond Marketplace - Trade Time-Locked Bonds",
    description: "Buy and sell time-locked bonds on our decentralized marketplace. Discover investment opportunities and manage your bond portfolio.",
    keywords: ["bond marketplace", "trade bonds", "buy bonds", "sell bonds"],
    path: "/transactions/marketplace",
  },
  holdings: {
    title: "My Holdings - Bond Portfolio Management",
    description: "View and manage your bond portfolio. Track your investments, yields, and maturity dates in one place.",
    keywords: ["bond holdings", "portfolio", "my bonds", "investment tracking"],
    path: "/transactions/holdings",
  },
  split: {
    title: "Split Bonds - Divide Your Bond Holdings",
    description: "Split your time-locked bonds into smaller units for better liquidity and trading flexibility.",
    keywords: ["split bonds", "bond division", "liquidity", "bond splitting"],
    path: "/split",
  },
};

// Generate structured data URLs
export const generateStructuredDataUrls = () => {
  return {
    organization: generateCanonicalUrl("/"),
    website: generateCanonicalUrl("/"),
    webApplication: generateCanonicalUrl("/"),
    breadcrumbList: generateCanonicalUrl("/"),
    faqPage: generateCanonicalUrl("/faq"),
    contactPage: generateCanonicalUrl("/contact"),
  };
};
