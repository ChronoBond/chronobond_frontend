"use client";

import { WalletPrompt } from "@/app/transactions/(components)/WalletPrompt";
import { type RedeemWalletPromptProps } from "@/types/redeem.types";

export const RedeemWalletPrompt = ({}: RedeemWalletPromptProps) => {
  return (
    <WalletPrompt
      title="Connect Wallet to Redeem Bonds"
      description="Please connect your Flow wallet to view and redeem your bonds"
    />
  );
};
