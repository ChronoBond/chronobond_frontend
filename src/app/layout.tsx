import { Inter } from "next/font/google";
import "./globals.css";
import { getMetadata, debugMetadata } from "@/lib/metadata";
import { FlowConfigProvider } from "@/components/flow-config-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

// Generate fresh metadata for each request - KISS principle
export const metadata = getMetadata('home');

// Debug metadata in development
if (process.env.NODE_ENV === 'development') {
  debugMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${inter.variable} font-inter antialiased bg-background text-foreground`}>
        <FlowConfigProvider>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
            <main className="relative">
              {children}
            </main>
            <Toaster />
          </div>
        </FlowConfigProvider>
      </body>
    </html>
  );
}