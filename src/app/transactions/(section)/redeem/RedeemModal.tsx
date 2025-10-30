"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TokenSelector } from "@/components/ui/token-selector";
import { QuoteDisplay } from "@/components/ui/quote-display";
import { type BondMaturityInfo } from "@/lib/bond-redemption-service";
import { Clock, Zap } from "lucide-react";

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

  if (!open || !bond) return null;

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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Redeem Bond</h3>
              <p className="text-xs text-white/60">Bond #{bond.bondID}</p>
            </div>
          </div>
        </div>

        {/* Bond Amount Display */}
        <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">
            Redemption Amount
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {bond.expectedTotal.toFixed(2)}
            </span>
            <span className="text-lg font-semibold text-white/80">FLOW</span>
          </div>
          <p className="text-xs text-white/60 mt-2">
            Principal + Yield
          </p>
        </div>

        {/* Token Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-white/70 mb-3 uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3" />
              Receive As
            </div>
          </label>
          <TokenSelector
            token={receiveToken}
            onTokenChange={onReceiveTokenChange}
            disabled={isRedeeming}
          />
        </div>

        {/* Quote Display */}
        {receiveToken === "USDC" && (
          <div className="mb-6">
            <QuoteDisplay
              fromToken="FLOW"
              toToken="USDC"
              fromAmount={bond.expectedTotal.toFixed(2)}
              toAmount={parseQuoteAmount(receiveQuote)}
              loading={quoteLoading}
              label="Conversion Rate"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isRedeeming}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isRedeeming}
            className="flex-1"
          >
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


