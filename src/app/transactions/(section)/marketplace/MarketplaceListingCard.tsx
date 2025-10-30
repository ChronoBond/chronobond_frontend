"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Loader2,
  Link as LinkIcon,
  CheckCircle,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import { type MarketplaceListingCardProps } from "@/types/marketplace.types";

export const MarketplaceListingCard = ({ 
  listing, 
  onPurchase, 
  isPurchasing, 
  formatFlow 
}: MarketplaceListingCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-brand-primary/40 hover:border-brand-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/10">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/10" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bond #{listing.bondID}</h3>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs px-2 py-1 ${
                listing.isAvailable 
                  ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/40' 
                  : 'bg-brand-error/20 text-brand-error border-brand-error/40'
              }`}>
                {listing.isAvailable ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Available
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Sold
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Listed Price</div>
            <div className="text-lg font-bold text-brand-accent">{listing.price} FLOW</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Status</div>
            <div className={`text-sm font-medium ${
              listing.isAvailable ? 'text-brand-accent' : 'text-brand-error'
            }`}>
              {listing.isAvailable ? "Available" : "Sold"}
            </div>
          </div>
        </div>
        
        {listing.isAvailable && (
          <Button
            onClick={() => onPurchase(listing)}
            disabled={isPurchasing}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg"
            size="lg"
          >
            {isPurchasing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Purchasing...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Purchase Bond
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
