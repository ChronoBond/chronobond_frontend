import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FlowConfigProvider } from "@/components/flow-config-provider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "ChronoBond - Time-Locked DeFi Bonds",
  description: "Mint and trade time-locked bonds on Flow blockchain with guaranteed yields",
  keywords: ["DeFi", "bonds", "yield", "Flow", "blockchain", "time-locked"],
  authors: [{ name: "ChronoBond Team" }],
  openGraph: {
    title: "ChronoBond - Time-Locked DeFi Bonds",
    description: "Mint and trade time-locked bonds on Flow blockchain with guaranteed yields",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-inter antialiased bg-background text-foreground`}>
        <FlowConfigProvider>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
            <main className="relative">
              {children}
            </main>
          </div>
        </FlowConfigProvider>
      </body>
    </html>
  );
}
