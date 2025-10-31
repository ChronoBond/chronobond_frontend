import { Inter } from "next/font/google";
import "./globals.css";
import { getMetadata, debugMetadata } from "@/lib/metadata";
import { FlowConfigProvider } from "@/components/flow-config-provider";
import { Toaster } from "@/components/ui/toaster";
import { RootLayoutClient } from "@/components/root-layout-client";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = getMetadata("home");

// Debug metadata in development
if (process.env.NODE_ENV === "development") {
  debugMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-inter antialiased bg-background text-foreground`}
      >
        <FlowConfigProvider>
          <RootLayoutClient>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
              <main className="relative">{children}</main>
              <Toaster />
            </div>
          </RootLayoutClient>
        </FlowConfigProvider>
      </body>
    </html>
  );
}
