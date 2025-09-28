"use client";

import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, RefreshCw } from "lucide-react";
import { bondRedemptionService } from "@/lib/bond-redemption-service";
import { BondRedemptionCard } from "./BondRedemptionCard";
import { type RedeemableBondsProps } from "@/types/redeem.types";

export const RedeemableBonds = ({ 
  redeemableBonds, 
  loading, 
  redeeming, 
  totalRedeemableValue, 
  onRefresh, 
  onRedeemBond, 
  onRedeemAllBonds 
}: RedeemableBondsProps) => {
  return (
    <div className="tab-content space-y-6">
      {/* Modern Bond List Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            💰 Ready for Redemption
          </h2>
          <p className="text-white/70">
            Redeem your matured bonds to receive principal + yield
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-64">
          <Button
            onClick={onRefresh}
            disabled={loading}
            variant="outline"
            size="sm"
            className="gap-2 bg-background/20 border-white/20 text-white hover:bg-white/10 w-full"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          {redeemableBonds.length > 0 && (
            <Button
              onClick={onRedeemAllBonds}
              disabled={loading}
              className="bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg w-full"
              size="sm"
            >
              💰 Redeem All (
              {bondRedemptionService.formatCurrency(totalRedeemableValue)})
            </Button>
          )}
        </div>
      </div>

      {/* Modern Bond List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-white/70">Loading redeemable bonds...</p>
          </div>
        </div>
      ) : redeemableBonds.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No bonds ready for redemption
          </h3>
          <p className="text-brand-neutral mb-6">
            Your bonds will appear here when they mature
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {redeemableBonds.map((bond) => (
            <BondRedemptionCard
              key={bond.bondID}
              bond={bond}
              onRedeem={onRedeemBond}
              isRedeeming={redeeming[bond.bondID] || false}
            />
          ))}
        </div>
      )}

      {/* Mobile Sticky Footer */}
      {redeemableBonds.length > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t border-white/10">
          <div className="flex gap-3">
            <Button
              onClick={onRefresh}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex-1 bg-background/20 border-white/20 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={onRedeemAllBonds}
              disabled={loading}
              className="flex-1 bg-brand-accent text-white hover:bg-brand-accent/90"
              size="sm"
            >
              💰 Redeem All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
