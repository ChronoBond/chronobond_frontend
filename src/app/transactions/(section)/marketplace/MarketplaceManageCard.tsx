"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Loader2,
  Link as LinkIcon,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { type MarketplaceManageCardProps } from "@/types/marketplace.types";

export const MarketplaceManageCard = ({
  listing,
  onWithdraw,
  isWithdrawing,
  formatFlow,
}: MarketplaceManageCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-semantic-surface backdrop-blur-xl border transition-all duration-300 hover:shadow-lg ${
        listing.isAvailable
          ? "border-brand-warning/40 hover:border-brand-warning/60"
          : "border-semantic-border hover:border-semantic-border/80"
      }`}
    >
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
              listing.isAvailable ? "bg-brand-900" : "bg-semantic-text-disabled"
            }`}
          >
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-semantic-text">
              Bond #{listing.bondID}
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                className={`text-xs px-2 py-1 ${
                  listing.isAvailable
                    ? "bg-brand-accent/20 text-brand-accent border-brand-accent/40"
                    : "bg-semantic-text-disabled/20 text-semantic-text-disabled border-semantic-text-disabled/40"
                }`}
              >
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
          <div className="bg-white/5 rounded-xl p-3 border border-semantic-border/50">
            <div className="text-xs text-semantic-text-secondary mb-1">
              Listed Price
            </div>
            <div className="text-lg font-bold text-brand-accent">
              {listing.price} FLOW
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-semantic-border/50 ">
            <div className="text-xs text-semantic-text-secondary mb-1">
              Status
            </div>
            <div
              className={`text-sm font-medium ${
                listing.isAvailable
                  ? "text-brand-accent"
                  : "text-semantic-text-disabled"
              }`}
            >
              {listing.isAvailable ? "Available" : "Sold"}
            </div>
          </div>
        </div>

        {listing.isAvailable && (
          <Button
            onClick={() => onWithdraw(listing)}
            disabled={isWithdrawing}
            className="w-full bg-brand-error text-white hover:bg-brand-error/90 shadow-lg"
            size="lg"
          >
            {isWithdrawing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Remove from Sale
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
