import type { Metadata } from "next";

// Environment-aware configuration - KISS principle
const getBaseConfig = () => {
  // Robust environment detection
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                  (isProduction ? "https://chronobond.com" : "http://localhost:3000");

  return {
    siteName: "ChronoBond",
    url: baseUrl,
    creator: "@ChronoBond",
    locale: "en_US" as const,
    type: "website" as const,
  };
};

// Common keywords - DRY principle
const commonKeywords = [
  "ChronoBond",
  "DeFi",
  "time-locked bonds",
  "Flow blockchain",
  "yield farming",
  "bond trading",
  "decentralized finance",
];

// Simple metadata generator - KISS principle
export function createMetadata(
  title: string,
  description: string,
  path: string = "",
  keywords: string[] = []
): Metadata {
  const baseConfig = getBaseConfig(); // Get fresh config each time
  const fullTitle = `${title} | ${baseConfig.siteName}`;
  const fullUrl = `${baseConfig.url}${path}`;
  const allKeywords = [...commonKeywords, ...keywords];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    metadataBase: new URL(baseConfig.url), // Fix for Next.js metadata resolution
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: baseConfig.siteName,
      images: [{ url: "/logo.png", width: 1200, height: 630, alt: fullTitle }],
      locale: baseConfig.locale,
      type: baseConfig.type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/logo.png"],
      creator: baseConfig.creator,
      site: baseConfig.creator,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

// Metadata utilities - KISS principle
export const getMetadata = (page: 'home' | 'transactions' | 'split') => {
  const configs = {
    home: {
      title: "ChronoBond - DeFi Time-Locked Bonds",
      description: "Mint, trade, and redeem time-locked bonds with guaranteed yields on Flow blockchain. Secure DeFi investment platform.",
      path: "/",
      keywords: ["homepage", "landing"]
    },
    transactions: {
      title: "Transactions",
      description: "Manage your time-locked bonds - mint, trade, redeem, and track your DeFi investments on Flow blockchain",
      path: "/transactions",
      keywords: ["bond transactions", "bond management"]
    },
    split: {
      title: "Split Bonds",
      description: "Split your time-locked bonds into smaller units for better liquidity and trading flexibility on Flow blockchain",
      path: "/split",
      keywords: ["split bonds", "bond division", "liquidity"]
    }
  };

  const config = configs[page];
  return createMetadata(config.title, config.description, config.path, config.keywords);
};

// Predefined metadata - YAGNI principle (only what we need)
export const metadata = {
  home: getMetadata('home'),
  transactions: getMetadata('transactions'),
  split: getMetadata('split'),
};

// Debug utility for troubleshooting metadata issues - KISS principle
export const debugMetadata = () => {
  if (process.env.NODE_ENV !== 'development') return null;

  const baseConfig = getBaseConfig();
  console.log('🔍 Metadata Debug Info:', {
    baseUrl: baseConfig.url,
    environment: process.env.NODE_ENV || 'unknown',
    baseUrlEnv: process.env.NEXT_PUBLIC_BASE_URL || 'not set',
  });
  return baseConfig;
};
