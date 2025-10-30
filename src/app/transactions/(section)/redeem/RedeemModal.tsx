"use client";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { type BondMaturityInfo } from "@/lib/bond-redemption-service";

interface RedeemModalProps {
  open: boolean;
  onClose: () => void;
  bond: BondMaturityInfo | null;
  receiveToken: "FLOW" | "USDC";
  onReceiveTokenChange: (t: "FLOW" | "USDC") => void;
  receiveQuote: string | null;
  quoteLoading?: boolean;
  isRedeeming?: boolean;
  onConfirm: () => void;
}

export const RedeemModal = ({
  open,
  onClose,
  bond,
  receiveToken,
  onReceiveTokenChange,
  receiveQuote,
  quoteLoading,
  isRedeeming,
  onConfirm,
}: RedeemModalProps) => {
  if (!open || !bond) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-2">Redeem Bond #{bond.bondID}</h3>
        <p className="text-white/80 mb-4">
          You will receive: {bond.expectedTotal.toFixed(2)} FLOW (Principal + Yield)
        </p>

        <div className="space-y-3 mb-4">
          <label className="block text-sm font-semibold mb-1">Receive as</label>
          <Select value={receiveToken} onValueChange={(v) => onReceiveTokenChange(v as "FLOW" | "USDC")}>
            <option value="FLOW">FLOW (default)</option>
            <option value="USDC">USDC</option>
          </Select>

          {receiveToken === "USDC" && (
            <div className="text-sm text-white/80">
              {quoteLoading ? "Fetching quote..." : receiveQuote ? `You will receive: ${receiveQuote}` : "Quote unavailable"}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isRedeeming}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isRedeeming}>
            {isRedeeming ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </span>
            ) : receiveToken === "USDC" ? (
              "Redeem to USDC"
            ) : (
              "Redeem"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RedeemModal;


