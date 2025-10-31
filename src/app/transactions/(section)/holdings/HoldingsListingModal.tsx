"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
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
  if (!isOpen || !selectedBond) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isDisabled={listingState.state === "pending"}>
      <div 
        className="relative rounded-2xl bg-semantic-surface border-2 border-semantic-border shadow-2xl p-6 max-w-md w-full max-h-[calc(100vh-2rem)] overflow-y-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-semantic-accent flex items-center justify-center shadow-lg">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-semantic-text">
              List Bond for Sale
            </h3>
            <p className="text-xs text-semantic-muted">Bond #{selectedBond.id}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-semantic-muted hover:text-semantic-text hover:bg-semantic-overlay flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-semantic-overlay rounded-xl p-4 border border-semantic-border">
            <p className="text-xs font-semibold text-semantic-muted mb-3 uppercase tracking-wide">
              Bond Details
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-semantic-muted">Principal:</span>
                <span className="font-semibold text-semantic-text">
                  {formatFlow(selectedBond.principal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-semantic-muted">Yield Rate:</span>
                <Badge className="bg-semantic-accent/20 text-semantic-accent border-semantic-accent/40 text-xs">
                  {(selectedBond.yieldRate * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-semantic-muted">Strategy:</span>
                <span className="font-medium text-semantic-text text-xs">
                  {selectedBond.strategyID}
                </span>
              </div>
              {selectedBondDetails && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-semantic-muted">Expected Total:</span>
                    <span className="font-semibold text-semantic-accent">
                      {formatFlow(selectedBondDetails.expectedTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-semantic-muted">Time to Maturity:</span>
                    <span className="font-medium text-semantic-text flex items-center gap-2">
                      {selectedBondDetails.isMatured ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-semantic-accent" />
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

          <div>
            <label className="block text-xs font-semibold text-semantic-muted mb-3 uppercase tracking-wide">
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
                className="pr-16 text-lg"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-semantic-muted">
                FLOW
              </div>
            </div>
            <p className="text-xs text-semantic-muted mt-2">
              Suggested: {formatFlow(selectedBond.principal * 1.2)} (20%
              markup)
            </p>
          </div>

          <div className="bg-semantic-accent/10 border border-semantic-accent/30 rounded-lg p-3 text-center">
            <span className="text-semantic-accent text-xs font-medium">
              ⛓️ Real Transaction - Will execute on Flow blockchain
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="default"
              onClick={onClose}
              disabled={listingState.state === "pending"}
              className="flex-1 !bg-semantic-surface hover:!bg-semantic-overlay !text-semantic-text !border !border-semantic-border"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirmListing}
              variant="default"
              disabled={
                listingState.state === "pending" ||
                !listingPrice ||
                parseFloat(listingPrice) <= 0 ||
                isNaN(parseFloat(listingPrice))
              }
              className="flex-1 !bg-semantic-accent hover:!bg-semantic-accent/90 !text-white !border-0"
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

          {listingState.statusString && (
            <div
              className={`p-3 rounded-lg text-sm border ${
                listingState.state === "success"
                  ? "bg-semantic-accent/10 text-semantic-accent border-semantic-accent/30"
                  : listingState.state === "error"
                  ? "bg-red-500/10 text-red-400 border-red-500/30"
                  : "bg-semantic-accent/10 text-semantic-accent border-semantic-accent/20"
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
                <div className="text-xs mt-1 text-semantic-muted break-all">
                  TX: {listingState.txId.substring(0, 16)}...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default HoldingsListingModal;
