"use client";

import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { type MarketplaceTransactionStatusProps } from "@/types/marketplace.types";

export const MarketplaceTransactionStatus = ({ txStatus }: MarketplaceTransactionStatusProps) => {
  if (!txStatus.statusString) return null;

  return (
    <div
      className={`p-4 rounded-lg border ${
        txStatus.state === "success"
          ? "bg-success/10 text-success border-success/20"
          : txStatus.state === "error"
          ? "bg-error/10 text-error border-error/20"
          : "bg-primary/10 text-primary border-primary/20"
      }`}
    >
      <div className="flex items-center gap-3">
        {["listing", "purchasing", "withdrawing"].includes(txStatus.state) && (
          <Loader2 className="w-5 h-5 animate-spin" />
        )}
        {txStatus.state === "success" && <CheckCircle className="w-5 h-5" />}
        {txStatus.state === "error" && <AlertTriangle className="w-5 h-5" />}
        <div>
          <div className="font-semibold">{txStatus.statusString}</div>
          {txStatus.txId && (
            <div className="text-xs mt-1 opacity-70">
              Transaction ID: {txStatus.txId}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
