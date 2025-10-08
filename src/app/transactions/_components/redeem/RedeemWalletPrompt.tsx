"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { type RedeemWalletPromptProps } from "@/types/redeem.types";

export const RedeemWalletPrompt = ({}: RedeemWalletPromptProps) => {
  return (
    <div className="app-container">
      <Card className="card-professional mx-auto max-w-md">
        <CardContent className="p-12 text-center">
          <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Wallet className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-4 gradient-text">
            Connect Wallet to Redeem Bonds
          </h3>
          <p className="text-muted-foreground mb-6">
            Please connect your Flow wallet to view and redeem your bonds
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
