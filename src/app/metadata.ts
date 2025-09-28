import type { Metadata } from "next";

export const metadata: Metadata = {
  // Primary metadata
  title: "ChronoBond - DeFi Time-Locked Bonds on Flow Blockchain",
  description: "Mint, trade, and redeem time-locked bonds with guaranteed yields on Flow blockchain. Secure DeFi investment platform with automated yield generation.",
  
  // Keywords for SEO
  keywords: [
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
  ],
  
  // Open Graph metadata for social media
  openGraph: {
    title: "ChronoBond - DeFi Time-Locked Bonds on Flow Blockchain",
    description: "Mint, trade, and redeem time-locked bonds with guaranteed yields on Flow blockchain. Secure DeFi investment platform with automated yield generation.",
    url: "https://chronobond.com",
    siteName: "ChronoBond",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ChronoBond - DeFi Time-Locked Bonds Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "ChronoBond - DeFi Time-Locked Bonds on Flow Blockchain",
    description: "Mint, trade, and redeem time-locked bonds with guaranteed yields on Flow blockchain.",
    images: ["/logo.png"],
    creator: "@ChronoBond",
    site: "@ChronoBond",
  },
  
  // Additional SEO metadata
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
  
  // Canonical URL
  alternates: {
    canonical: "https://chronobond.com",
  },
  
  // Icons and favicons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  
  // Manifest for PWA
  manifest: "/site.webmanifest",
  
  // Additional metadata
  authors: [{ name: "ChronoBond Team" }],
  creator: "ChronoBond",
  publisher: "ChronoBond",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Viewport and theme
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  
  // Verification tags (add your actual verification codes)
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
}; 