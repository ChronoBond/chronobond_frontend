"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
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
    <Modal isOpen={open} onClose={onClose} isDisabled={isPurchasing}>
      <div 
        className="rounded-2xl bg-semantic-surface p-6 border border-semantic-border shadow-2xl max-w-sm w-full max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-900 border border-semantic-border flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-semantic-text">Buy Bond</h3>
              <p className="text-xs text-semantic-text/70">Bond #{listing.bondID}</p>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="mb-6 p-4 rounded-lg bg-semantic-overlay border border-semantic-border">
          <p className="text-xs font-semibold text-semantic-text/80 mb-2 uppercase tracking-wide">
            Listing Price
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-semantic-accent">
              {listing.price.toFixed(2)}
            </span>
            <span className="text-lg font-semibold text-semantic-text">FLOW</span>
          </div>
        </div>

        {/* Token Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-semantic-text mb-3 uppercase tracking-wide">
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
              : "bg-semantic-accent/10 border-semantic-accent/30"
          }`}>
            <div className="flex items-center gap-2">
              {insufficientFlow && (
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              )}
              <p className={`text-xs font-medium ${insufficientFlow ? "text-red-400" : "text-semantic-accent"}`}>
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
    </Modal>
  );
};

export default BuyModal;


