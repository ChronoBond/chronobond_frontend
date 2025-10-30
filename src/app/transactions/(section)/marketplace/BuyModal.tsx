"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TokenSelector } from "@/components/ui/token-selector";
import { QuoteDisplay } from "@/components/ui/quote-display";
import { type MarketplaceListing } from "@/lib/marketplace-service";
import { ShoppingCart, Wallet, AlertCircle } from "lucide-react";

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
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open || !listing) return null;

  const insufficientFlow =
    payToken === "FLOW" && typeof flowBalance === "number" && flowBalance < listing.price;

  // Parse the quote to extract numeric value
  const parseQuoteAmount = (quote: string | null) => {
    if (!quote) return null;
    const match = quote.match(/~?([\d.]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4">
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-background/95 via-background/85 to-background/80 p-6 border border-white/20 shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-white/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Buy Bond</h3>
              <p className="text-xs text-white/60">Bond #{listing.bondID}</p>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
            Listing Price
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
              {listing.price.toFixed(2)}
            </span>
            <span className="text-lg font-semibold text-white/80">FLOW</span>
          </div>
        </div>

        {/* Token Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-white/70 mb-3 uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <Wallet className="w-3 h-3" />
              Pay With
            </div>
          </label>
          <TokenSelector
            token={payToken}
            onTokenChange={onPayTokenChange}
            disabled={isPurchasing}
          />
        </div>

        {/* Balance Info */}
        {payToken === "FLOW" && (
          <div className={`mb-6 p-3 rounded-lg border ${
            insufficientFlow
              ? "bg-red-500/10 border-red-500/30"
              : "bg-blue-500/10 border-blue-500/30"
          }`}>
            <div className="flex items-center gap-2">
              {insufficientFlow && (
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              )}
              <p className={`text-xs ${insufficientFlow ? "text-red-400" : "text-blue-400"}`}>
                {typeof flowBalance === "number" 
                  ? `Balance: ${flowBalance.toFixed(6)} FLOW`
                  : "Loading balance..."}
                {insufficientFlow && " — Insufficient FLOW"}
              </p>
            </div>
          </div>
        )}

        {/* Quote Display */}
        {payToken === "USDC" && (
          <div className="mb-6">
            <QuoteDisplay
              fromToken="USDC"
              toToken="FLOW"
              fromAmount={parseQuoteAmount(payQuote) || "—"}
              toAmount={listing.price.toFixed(2)}
              loading={quoteLoading}
              label="You Will Pay"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={Boolean(isPurchasing)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={Boolean(isPurchasing) || insufficientFlow}
            className="flex-1"
          >
            {isPurchasing ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </span>
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


