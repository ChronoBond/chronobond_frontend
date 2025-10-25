"use client";

import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { type MintTransactionStatusProps } from "@/types/mint.types";

export const MintTransactionStatus = ({ txStatus }: MintTransactionStatusProps) => {
  if (!txStatus.statusString) return null;

  return (
    <div className={`p-4 rounded-lg border ${
      txStatus.state === "success"
        ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20"
        : txStatus.state === "error"
        ? "bg-brand-error/10 text-brand-error border-brand-error/20"
        : "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
    }`}>
      <div className="flex items-center gap-3">
        {["checking", "setup", "minting"].includes(txStatus.state) && (
          <Loader2 className="w-5 h-5 animate-spin" />
        )}
        {txStatus.state === "success" && <CheckCircle className="w-5 h-5" />}
        {txStatus.state === "error" && <AlertCircle className="w-5 h-5" />}
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
