import { Inter } from "next/font/google";
import "./globals.css";
import { metadata as homeMetadata } from "@/lib/metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata = homeMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}