"use client";

import { DollarSign, CheckCircle, Clock, Bell } from "lucide-react";
import { bondRedemptionService } from "@/lib/bond-redemption-service";
import { type RedeemHeaderProps } from "@/types/redeem.types";

export const RedeemHeader = ({
  redeemableBonds,
  pendingBonds,
  nearingMaturity,
  totalRedeemableValue,
}: RedeemHeaderProps) => {
  return (
    <div className="reveal-item">
      <div className="relative overflow-hidden rounded-2xl bg-semantic-surface backdrop-blur-xl border border-semantic-border p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-900 flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-semantic-text">
                Bond Redemption Center
              </h1>
              <p className="text-brand-neutral text-lg">
                Redeem your matured bonds and track upcoming maturities
              </p>
            </div>
          </div>

          {/* Compact Status Overview Bar */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/40">
              <span className="text-brand-accent font-medium text-sm flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {redeemableBonds.length}{" "}
                Ready
              </span>
              <span className="text-brand-accent/80 text-sm">
                {bondRedemptionService.formatCurrency(totalRedeemableValue)}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/40">
              <span className="text-brand-primary font-medium text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {pendingBonds.length} Pending
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-warning/10 border border-brand-warning/40">
              <span className="text-brand-warning font-medium text-sm flex items-center gap-1">
                <Bell className="w-3.5 h-3.5" /> {nearingMaturity.length}{" "}
                Nearing
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
