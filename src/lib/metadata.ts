import type { Metadata } from "next";

// Base configuration - DRY principle
const baseConfig = {
  siteName: "ChronoBond",
  url: "https://chronobond.com",
  creator: "@ChronoBond",
  locale: "en_US" as const,
  type: "website" as const,
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
  const fullTitle = `${title} | ${baseConfig.siteName}`;
  const fullUrl = `${baseConfig.url}${path}`;
  const allKeywords = [...commonKeywords, ...keywords];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
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

// Predefined metadata - YAGNI principle (only what we need)
export const metadata = {
  home: createMetadata(
    "ChronoBond - DeFi Time-Locked Bonds",
    "Mint, trade, and redeem time-locked bonds with guaranteed yields on Flow blockchain. Secure DeFi investment platform.",
    "/",
    ["homepage", "landing"]
  ),
  
  transactions: createMetadata(
    "Transactions",
    "Manage your time-locked bonds - mint, trade, redeem, and track your DeFi investments on Flow blockchain",
    "/transactions",
    ["bond transactions", "bond management"]
  ),
  
  split: createMetadata(
    "Split Bonds",
    "Split your time-locked bonds into smaller units for better liquidity and trading flexibility on Flow blockchain",
    "/split",
    ["split bonds", "bond division", "liquidity"]
  ),
};
