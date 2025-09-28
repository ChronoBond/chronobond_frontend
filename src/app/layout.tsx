import { Inter } from "next/font/google";
import "./globals.css";
import { metadata as homeMetadata } from "@/lib/metadata";
import { FlowConfigProvider } from "@/components/flow-config-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata = homeMetadata;

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