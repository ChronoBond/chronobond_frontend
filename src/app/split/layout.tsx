import { getMetadata } from "@/lib/metadata";

// Generate fresh metadata for each request - KISS principle
export const metadata = getMetadata('split');

export default function SplitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
