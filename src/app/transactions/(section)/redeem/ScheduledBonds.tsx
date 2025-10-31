"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  RefreshCw,
  X,
  Calendar,
  Percent,
} from "lucide-react";
import { bondRedemptionService } from "@/lib/bond-redemption-service";
import { type ReinvestmentConfig } from "@/types/redeem.types";
import type { BondMaturityInfo } from "@/lib/bond-redemption-service";

interface ScheduledBondsProps {
  scheduledBonds?: { [bondID: number]: ReinvestmentConfig };
  pendingBonds: BondMaturityInfo[];
  loading: boolean;
  cancelingReinvestment?: { [bondID: number]: boolean };
  onRefresh: () => Promise<void>;
  onCancelReinvest?: (bondID: number) => Promise<void>;
}

export const ScheduledBonds = ({
  scheduledBonds = {},
  pendingBonds,
  loading,
  cancelingReinvestment,
  onRefresh,
  onCancelReinvest,
}: ScheduledBondsProps) => {
  // Get pending bonds that are scheduled for auto-reinvestment
  const scheduledPendingBonds = pendingBonds.filter(
    (bond) => scheduledBonds[bond.bondID]
  );

  return (
    <div className="tab-content space-y-6">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-semantic-text mb-2">
            Auto-Reinvesting Bonds
          </h2>
          <p className="text-semantic-text-secondary">
            Bonds scheduled to automatically reinvest at maturity
          </p>
        </div>
        <Button
          onClick={onRefresh}
          disabled={loading}
          variant="ghost"
          size="sm"
          className="gap-2 text-semantic-text-secondary hover:bg-semantic-border/50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-white/70">Loading auto-reinvesting bonds...</p>
          </div>
        </div>
      ) : scheduledPendingBonds.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No auto-reinvesting bonds
          </h3>
          <p className="text-brand-neutral mb-6">
            You don&apos;t have any pending bonds scheduled for auto-reinvestment
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledPendingBonds.map((bond) => {
            const config = scheduledBonds[bond.bondID];
            return (
              <div
                key={bond.bondID}
                className="group relative overflow-hidden rounded-2xl bg-semantic-surface backdrop-blur-xl border border-green-500/40 hover:border-green-500/60 transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-900/30 flex items-center justify-center shadow-lg border border-green-500/40">
                      <RefreshCw className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-semantic-text">
                        Bond #{bond.bondID}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className="text-xs px-2 py-1 bg-green-500/20 text-green-400 border-green-500/40">
                          🔄 Auto-Reinvest Active
                        </Badge>
                        <Badge className="text-xs px-2 py-1 bg-brand-primary/20 text-brand-primary border-brand-primary/40">
                          Pending Maturity
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-3 border border-semantic-border/50">
                      <div className="text-xs text-semantic-text-secondary mb-1">
                        Principal
                      </div>
                      <div className="text-lg font-bold text-semantic-text">
                        {bondRedemptionService.formatCurrency(bond.principal)}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-semantic-border/50">
                      <div className="text-xs text-semantic-text-secondary mb-1">
                        Expected Yield
                      </div>
                      <div className="text-lg font-bold text-brand-primary">
                        {bondRedemptionService.formatCurrency(bond.expectedYield)}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-semantic-border/50">
                      <div className="text-xs text-semantic-text-secondary mb-1">
                        Maturity Date
                      </div>
                      <div className="text-sm font-medium text-semantic-text">
                        {bondRedemptionService.formatDate(bond.maturityDate)}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-semantic-border/50">
                      <div className="text-xs text-semantic-text-secondary mb-1">
                        Time Left
                      </div>
                      <div className="text-sm font-medium text-semantic-text">
                        {bondRedemptionService.formatTimeRemaining(
                          bond.timeUntilMaturity
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reinvestment Config */}
                  {config && (
                    <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 mb-6">
                      <h4 className="text-sm font-semibold text-green-400 mb-3">
                        Reinvestment Configuration
                      </h4>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-400/60" />
                          <div>
                            <div className="text-xs text-semantic-text-secondary">
                              Duration
                            </div>
                            <div className="text-sm font-semibold text-semantic-text">
                              {Math.floor(config.newDuration)} months
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-green-400/60" />
                          <div>
                            <div className="text-xs text-semantic-text-secondary">
                              Yield Rate
                            </div>
                            <div className="text-sm font-semibold text-semantic-text">
                              {(config.newYieldRate * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-semantic-text-secondary">
                            Strategy
                          </div>
                          <div className="text-sm font-semibold text-semantic-text capitalize">
                            {config.newStrategyID}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancel Button */}
                  <Button
                    onClick={() => onCancelReinvest?.(bond.bondID)}
                    disabled={cancelingReinvestment?.[bond.bondID]}
                    variant="ghost"
                    className="w-full gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4" />
                    {cancelingReinvestment?.[bond.bondID]
                      ? "Canceling..."
                      : "Cancel Auto-Reinvest"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
