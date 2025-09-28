import { metadata as splitMetadata } from "@/lib/metadata";

export const metadata = splitMetadata;

export default function SplitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
