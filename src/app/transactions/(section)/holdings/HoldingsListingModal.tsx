"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, DollarSign, Loader2, CheckCircle, Tag } from "lucide-react";
import { chronoBondService } from "@/lib/chronobond-service";
import { type ListingModalProps } from "@/types/holding.types";

export const HoldingsListingModal = ({
  isOpen,
  selectedBond,
  selectedBondDetails,
  listingPrice,
  listingState,
  onClose,
  onPriceChange,
  onConfirmListing,
  formatFlow,
}: ListingModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !selectedBond) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/95 via-background/85 to-background/80 border border-white/20 p-6 max-w-md w-full shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5" />
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-white/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                List Bond for Sale
              </h3>
              <p className="text-xs text-white/60">Bond #{selectedBond.id}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Bond Details */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs font-semibold text-white/70 mb-3 uppercase tracking-wide">
                Bond Details
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Principal:</span>
                  <span className="font-semibold text-white">
                    {formatFlow(selectedBond.principal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Yield Rate:</span>
                  <Badge className="bg-brand-primary/20 text-brand-primary border-brand-primary/40 text-xs">
                    {(selectedBond.yieldRate * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Strategy:</span>
                  <span className="font-medium text-white text-xs">
                    {selectedBond.strategyID}
                  </span>
                </div>
                {selectedBondDetails && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Expected Total:</span>
                      <span className="font-semibold text-brand-accent">
                        {formatFlow(selectedBondDetails.expectedTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Time to Maturity:</span>
                      <span className="font-medium text-white flex items-center gap-2">
                        {selectedBondDetails.isMatured ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                            Matured
                          </>
                        ) : (
                          chronoBondService.formatTimeUntilMaturity(
                            selectedBondDetails.timeUntilMaturity
                          )
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Listing Price Input */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-3 uppercase tracking-wide">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3 h-3" />
                  Set Your Price
                </div>
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Enter listing price"
                  value={listingPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onPriceChange(e.target.value)
                  }
                  min="0"
                  step="0.01"
                  className="pr-16 text-lg bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-white/70">
                  FLOW
                </div>
              </div>
              <p className="text-xs text-white/60 mt-2">
                Suggested: {formatFlow(selectedBond.principal * 1.2)} (20%
                markup)
              </p>
            </div>

            {/* Info Banner */}
            <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-lg p-3 text-center">
              <span className="text-brand-primary text-xs font-medium">
                ⛓️ Real Transaction - Will execute on Flow blockchain
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={listingState.state === "pending"}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirmListing}
                variant="primary"
                disabled={
                  listingState.state === "pending" ||
                  !listingPrice ||
                  parseFloat(listingPrice) <= 0 ||
                  isNaN(parseFloat(listingPrice))
                }
                className="flex-1"
              >
                {listingState.state === "pending" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Confirm Listing"
                )}
              </Button>
            </div>

            {/* Status Message */}
            {listingState.statusString && (
              <div
                className={`p-3 rounded-lg text-sm border ${
                  listingState.state === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : listingState.state === "error"
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  {listingState.state === "pending" && (
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  )}
                  {listingState.state === "success" && (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{listingState.statusString}</span>
                </div>
                {listingState.txId && (
                  <div className="text-xs mt-1 opacity-70 break-all">
                    TX: {listingState.txId.substring(0, 16)}...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
