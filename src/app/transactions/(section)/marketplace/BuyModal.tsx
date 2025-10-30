"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Select } from "@/components/ui/select";
import { type MarketplaceListing } from "@/lib/marketplace-service";

interface BuyModalProps {
  open: boolean;
  onClose: () => void;
  listing: MarketplaceListing | null;
  payToken: "FLOW" | "USDC";
  onPayTokenChange: (t: "FLOW" | "USDC") => void;
  payQuote: string | null;
  quoteLoading?: boolean;
  onConfirm: () => void;
  isPurchasing?: boolean;
  flowBalance?: number;
}

export const BuyModal = ({
  open,
  onClose,
  listing,
  payToken,
  onPayTokenChange,
  payQuote,
  quoteLoading,
  onConfirm,
  isPurchasing,
  flowBalance,
}: BuyModalProps) => {
  if (!open || !listing) return null;
  const insufficientFlow =
    payToken === "FLOW" && typeof flowBalance === "number" && flowBalance < listing.price;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-2">Buy Bond #{listing.bondID}</h3>
        <p className="text-white/80 mb-4">Price: {listing.price} FLOW</p>

        <div className="space-y-3 mb-4">
          <label className="block text-sm font-semibold mb-1">Pay with</label>
          <Select value={payToken} onValueChange={(v) => onPayTokenChange(v as "FLOW" | "USDC")}>
            <option value="FLOW">FLOW (default)</option>
            <option value="USDC">USDC</option>
          </Select>
          {payToken === "USDC" && (
            <div className="text-sm text-white/80">
              {quoteLoading ? "Fetching quote..." : payQuote ? `You will pay: ${payQuote}` : "Quote unavailable"}
            </div>
          )}
        </div>

        {payToken === "FLOW" && (
          <div className="text-xs text-white/70 mb-3">
            Balance: {typeof flowBalance === "number" ? `${flowBalance.toFixed(6)} FLOW` : "—"}
            {insufficientFlow && <span className="text-brand-error ml-2">Insufficient FLOW</span>}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={Boolean(isPurchasing) || insufficientFlow}>
            {isPurchasing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...
              </>
            ) : payToken === "USDC" ? (
              "Buy with USDC"
            ) : (
              "Buy Now"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;


