"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Clock,
  RefreshCw,
  RotateCcw,
  CheckCircle,
  Plus,
  X,
} from "lucide-react";
import { bondRedemptionService } from "@/lib/bond-redemption-service";
import { type PendingBondsProps } from "@/types/redeem.types";

export const PendingBonds = ({
  pendingBonds,
  loading,
  redeeming,
  onRefresh,
  onReinvestBond,
  reinvestedBondIDs,
  scheduledBonds,
  loadingReinvestStatus,
  onScheduleReinvest,
  onCancelReinvest,
  schedulingReinvestment,
  cancelingReinvestment,
}: PendingBondsProps & {
  redeeming?: { [key: number]: boolean };
  onReinvestBond?: (bond: any) => void;
  reinvestedBondIDs?: Set<number>;
  scheduledBonds?: { [bondID: number]: any };
  loadingReinvestStatus?: boolean;
  onScheduleReinvest?: (bondID: number, duration: number, yieldRate: number, strategyID: string) => Promise<void>;
  onCancelReinvest?: (bondID: number) => Promise<void>;
  schedulingReinvestment?: { [bondID: number]: boolean };
  cancelingReinvestment?: { [bondID: number]: boolean };
}) => {
  return (
    <div className="tab-content space-y-6">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-semantic-text mb-2">
            Pending Bonds
          </h2>
          <p className="text-semantic-text-secondary">
            Bonds that are still maturing and not yet ready for redemption
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
            <p className="text-white/70">Loading pending bonds...</p>
          </div>
        </div>
      ) : pendingBonds.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No pending bonds
          </h3>
          <p className="text-brand-neutral mb-6">
            All your bonds have matured or you don&apos;t have any bonds yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBonds.map((bond) => (
            <div
              key={bond.bondID}
              className="group relative overflow-hidden rounded-2xl bg-semantic-surface backdrop-blur-xl border border-brand-primary/40 hover:border-brand-primary/60 transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-900 flex items-center justify-center shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-semantic-text">
                      Bond #{bond.bondID}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="text-xs px-2 py-1 bg-brand-primary/20 text-brand-primary border-brand-primary/40">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Maturity
                      </Badge>
                      {scheduledBonds?.[bond.bondID] && (
                        <Badge className="text-xs px-2 py-1 bg-green-500/20 text-green-400 border-green-500/40">
                          🔄 Auto-Reinvest Scheduled
                        </Badge>
                      )}
                      {reinvestedBondIDs?.has(bond.bondID) && (
                        <Badge className="text-xs px-2 py-1 bg-green-500/20 text-green-400 border-green-500/40">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Reinvested
                        </Badge>
                      )}
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
                      Time Left
                    </div>
                    <div className="text-sm font-medium text-semantic-text">
                      {bondRedemptionService.formatTimeRemaining(
                        bond.timeUntilMaturity
                      )}
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
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-semantic-border/50">
                  <div className="text-xs text-semantic-text-secondary mb-1">
                    Expected Total
                  </div>
                  <div className="text-lg font-bold text-brand-warning">
                    {bondRedemptionService.formatCurrency(bond.expectedTotal)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mt-6">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => onReinvestBond?.(bond)}
                      disabled={
                        loading ||
                        redeeming?.[bond.bondID] ||
                        reinvestedBondIDs?.has(bond.bondID)
                      }
                      className={`flex-1 gap-2 shadow-lg ${
                        reinvestedBondIDs?.has(bond.bondID)
                          ? "bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30 cursor-not-allowed"
                          : "bg-brand-primary hover:bg-brand-primary/90 text-white"
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      {reinvestedBondIDs?.has(bond.bondID)
                        ? "✓ Reinvested"
                        : redeeming?.[bond.bondID]
                        ? "Reinvesting..."
                        : "Reinvest Now"}
                    </Button>
                  </div>

                  {/* Auto-Reinvest Schedule/Cancel Buttons */}
                  {!scheduledBonds?.[bond.bondID] ? (
                    <Button
                      onClick={() => {
                        // Default reinvestment config
                        const duration = 12; // months
                        const yieldRate = 0.08; // 8%
                        const strategyID = "default";
                        onScheduleReinvest?.(bond.bondID, duration, yieldRate, strategyID);
                      }}
                      disabled={
                        loading || 
                        loadingReinvestStatus || 
                        schedulingReinvestment?.[bond.bondID]
                      }
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 text-semantic-text-secondary hover:text-semantic-text"
                    >
                      <Plus className="w-4 h-4" />
                      {schedulingReinvestment?.[bond.bondID] 
                        ? "Scheduling..." 
                        : loadingReinvestStatus 
                        ? "Loading..." 
                        : "Schedule Auto-Reinvest"}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-xs text-semantic-text-secondary px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                        <span className="text-green-400 font-semibold">✓ Auto-Reinvest Active</span>
                        <p className="mt-1">
                          This bond will be automatically reinvested on maturity
                        </p>
                      </div>
                      <Button
                        onClick={() => onCancelReinvest?.(bond.bondID)}
                        disabled={
                          loading || 
                          loadingReinvestStatus || 
                          cancelingReinvestment?.[bond.bondID]
                        }
                        variant="ghost"
                        size="sm"
                        className="w-full gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                        {cancelingReinvestment?.[bond.bondID] 
                          ? "Canceling..." 
                          : loadingReinvestStatus 
                          ? "Loading..." 
                          : "Cancel Auto-Reinvest"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
