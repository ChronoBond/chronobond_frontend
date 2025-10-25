"use client";

import { WalletPrompt } from "@/app/transactions/(components)/WalletPrompt";
import { type MintWalletPromptProps } from "@/types/mint.types";

export const MintWalletPrompt = ({}: MintWalletPromptProps) => {
  return (
    <WalletPrompt
      title="Connect Wallet to Mint Bonds"
      description="Please connect your Flow wallet to start minting time-locked bonds"
    />
  );
};
