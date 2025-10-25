"use client";

import { WalletPrompt } from "@/app/transactions/(components)/WalletPrompt";

export const HoldingsWalletPrompt = () => {
  return (
    <WalletPrompt
      title="Connect Wallet to View Holdings"
      description="Please connect your Flow wallet to view your bond portfolio"
    />
  );
};
