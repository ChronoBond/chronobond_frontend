import { getMetadata } from "@/lib/metadata";

// Generate fresh metadata for each request - KISS principle
export const metadata = getMetadata('transactions');

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
