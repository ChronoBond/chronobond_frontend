import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata("transactions");

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
