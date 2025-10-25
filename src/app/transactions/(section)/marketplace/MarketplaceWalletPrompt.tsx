"use client";

import { WalletPrompt } from "@/app/transactions/(components)/WalletPrompt";

export const MarketplaceWalletPrompt = () => {
  return (
    <WalletPrompt
      title="Connect Wallet to Access Marketplace"
      description="Please connect your Flow wallet to browse and trade bonds"
    />
  );
};
