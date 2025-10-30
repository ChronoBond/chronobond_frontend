import type { Metadata } from "next";

const baseMetadata = {
  siteName: "ChronoBond",
  url: "https://chronobond.com",
  creator: "@ChronoBond",
  publisher: "ChronoBond",
  locale: "en_US",
  type: "website" as const,
};

const commonKeywords = [
  "ChronoBond",
  "DeFi",
  "time-locked bonds",
  "Flow blockchain",
  "yield farming",
  "bond trading",
  "decentralized finance",
  "automated yield",
  "bond marketplace",
  "Flow DeFi",
  "crypto bonds",
  "blockchain bonds"
];

export const generatePageMetadata = (
  title: string,
  description: string,
  path: string,
  keywords: string[] = [],
  image?: string
): Metadata => {
  const fullTitle = `${title} | ChronoBond`;
  const fullDescription = `${description} - ChronoBond DeFi Platform`;
  const fullUrl = `${baseMetadata.url}${path}`;
  const fullKeywords = [...commonKeywords, ...keywords];

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: baseMetadata.siteName,
      images: [
        {
          url: image || "/logo.png",
          width: 1200,
          height: 630,
          alt: `${title} - ChronoBond Platform`,
        },
      ],
      locale: baseMetadata.locale,
      type: baseMetadata.type,
    },
    
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [image || "/logo.png"],
      creator: baseMetadata.creator,
      site: baseMetadata.creator,
    },
    
    alternates: {
      canonical: fullUrl,
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
};

export const pageMetadata = {
  home: generatePageMetadata(
    "ChronoBond - DeFi Time-Locked Bonds on Flow Blockchain",
    "Mint, trade, and redeem time-locked bonds with guaranteed yields on Flow blockchain. Secure DeFi investment platform with automated yield generation.",
    "/",
    ["homepage", "main", "landing"]
  ),
  
  mint: generatePageMetadata(
    "Mint Bonds - Create Time-Locked Bonds",
    "Create and mint time-locked bonds with guaranteed yields. Choose from multiple yield strategies and lock-up periods.",
    "/transactions/mint",
    ["mint bonds", "create bonds", "bond creation", "yield strategies"]
  ),
  
  redeem: generatePageMetadata(
    "Redeem Bonds - Claim Your Matured Bonds",
    "Redeem your matured time-locked bonds and claim your principal plus yield. Track bond maturity and manage your portfolio.",
    "/transactions/redeem",
    ["redeem bonds", "claim bonds", "bond redemption", "matured bonds"]
  ),
  
  marketplace: generatePageMetadata(
    "Bond Marketplace - Trade Time-Locked Bonds",
    "Buy and sell time-locked bonds on our decentralized marketplace. Discover investment opportunities and manage your bond portfolio.",
    "/transactions/marketplace",
    ["bond marketplace", "trade bonds", "buy bonds", "sell bonds", "bond trading"]
  ),
  
  holdings: generatePageMetadata(
    "My Holdings - Bond Portfolio Management",
    "View and manage your bond portfolio. Track your investments, yields, and maturity dates in one place.",
    "/transactions/holdings",
    ["bond holdings", "portfolio", "my bonds", "investment tracking"]
  ),
  
  split: generatePageMetadata(
    "Split Bonds - Divide Your Bond Holdings",
    "Split your time-locked bonds into smaller units for better liquidity and trading flexibility.",
    "/split",
    ["split bonds", "bond division", "liquidity", "bond splitting"]
  ),
};

export const generateStructuredData = (page: string) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ChronoBond",
    description: "DeFi platform for time-locked bonds on Flow blockchain",
    url: baseMetadata.url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free to use DeFi platform"
    },
    creator: {
      "@type": "Organization",
      name: "ChronoBond Team"
    }
  };

  switch (page) {
    case "mint":
      return {
        ...baseStructuredData,
        "@type": "WebApplication",
        name: "ChronoBond - Mint Bonds",
        description: "Create and mint time-locked bonds with guaranteed yields"
      };
    case "redeem":
      return {
        ...baseStructuredData,
        "@type": "WebApplication", 
        name: "ChronoBond - Redeem Bonds",
        description: "Redeem matured time-locked bonds and claim your yield"
      };
    case "marketplace":
      return {
        ...baseStructuredData,
        "@type": "WebApplication",
        name: "ChronoBond - Bond Marketplace", 
        description: "Trade time-locked bonds on decentralized marketplace"
      };
    default:
      return baseStructuredData;
  }
};
