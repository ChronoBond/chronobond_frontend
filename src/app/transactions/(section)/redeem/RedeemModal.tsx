"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
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
  if (!open || !bond) return null;

  // Parse the quote to extract numeric value
  const parseQuoteAmount = (quote: string | null) => {
    if (!quote) return null;
    const match = quote.match(/~?([\d.]+)/);
    return match ? match[1] : null;
  };

  return (
    <Modal isOpen={open} onClose={onClose} isDisabled={isRedeeming}>
      <div 
        className="rounded-2xl bg-semantic-surface p-6 border border-semantic-border shadow-2xl max-w-sm w-full max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-900 border border-semantic-border flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-semantic-text">Redeem Bond</h3>
              <p className="text-xs text-semantic-text/70">Bond #{bond.bondID}</p>
            </div>
          </div>
        </div>

        {/* Bond Amount Display */}
        <div className="mb-6 p-4 rounded-lg bg-semantic-overlay border border-semantic-border">
          <p className="text-xs font-semibold text-semantic-text/80 mb-2 uppercase tracking-wide">
            Redemption Amount
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-semantic-accent">
              {bond.expectedTotal.toFixed(2)}
            </span>
            <span className="text-lg font-semibold text-semantic-text">FLOW</span>
          </div>
          <p className="text-xs text-semantic-text/70 mt-2">
            Principal + Yield
          </p>
        </div>

        {/* Token Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-semantic-text mb-3 uppercase tracking-wide">
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
    </Modal>
  );
};

export default RedeemModal;


