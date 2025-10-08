"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  DollarSign, 
  Loader2, 
  CheckCircle
} from "lucide-react";
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
  formatFlow
}: ListingModalProps) => {
  if (!isOpen || !selectedBond) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-mobile">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-white/10 p-6 max-w-md w-full shadow-2xl modal-content-mobile">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">List Bond for Sale</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        
          <div className="space-y-4">
            <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-lg p-3 text-center">
              <span className="text-brand-accent text-sm font-medium">
                🚀 Real Transaction - Will execute on Flow blockchain
              </span>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Bond ID:</span>
                  <span className="font-medium text-white">#{selectedBond.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Principal:</span>
                  <span className="font-medium text-white">{formatFlow(selectedBond.principal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Yield Rate:</span>
                  <Badge className="bg-brand-primary/20 text-brand-primary border-brand-primary/40 text-xs">
                    {(selectedBond.yieldRate * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Strategy:</span>
                  <span className="font-medium text-white">{selectedBond.strategyID}</span>
                </div>
                {selectedBondDetails && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Expected Total:</span>
                      <span className="font-medium text-brand-accent">{formatFlow(selectedBondDetails.expectedTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Time to Maturity:</span>
                      <span className="font-medium text-white">
                        {selectedBondDetails.isMatured ? "Matured" : chronoBondService.formatTimeUntilMaturity(selectedBondDetails.timeUntilMaturity)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">
                Listing Price
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <Input
                  type="number"
                  placeholder="Enter price"
                  value={listingPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPriceChange(e.target.value)}
                  min="0"
                  step="0.01"
                  className="pl-10 pr-16 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-white/70 bg-white/10 px-2 py-1 rounded">
                  FLOW
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onConfirmListing}
                disabled={listingState.state === 'pending' || !listingPrice || parseFloat(listingPrice) <= 0 || isNaN(parseFloat(listingPrice))}
                className="flex-1 bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg"
              >
                {listingState.state === 'pending' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Confirm Listing"
                )}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 bg-background/20 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          
            {listingState.statusString && (
              <div className={`p-3 rounded-lg text-sm border ${
                listingState.state === 'success' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' :
                listingState.state === 'error' ? 'bg-brand-error/10 text-brand-error border-brand-error/20' :
                'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
              }`}>
                <div className="flex items-center gap-2">
                  {listingState.state === 'pending' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {listingState.state === 'success' && <CheckCircle className="w-4 h-4" />}
                  <span>{listingState.statusString}</span>
                </div>
                {listingState.txId && (
                  <div className="text-xs mt-1 opacity-70">
                    TX ID: {listingState.txId}
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
