"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bell, RefreshCw } from "lucide-react";
import { bondRedemptionService } from "@/lib/bond-redemption-service";
import { type NotificationsProps } from "@/types/redeem.types";

export const Notifications = ({ 
  nearingMaturity, 
  loading, 
  onRefresh 
}: NotificationsProps) => {
  return (
    <div className="tab-content space-y-6">
      {/* Modern Notifications Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            🔔 Maturity Notifications
          </h2>
          <p className="text-white/70">
            Bonds nearing maturity (within 24 hours)
          </p>
        </div>
        <Button
          onClick={onRefresh}
          disabled={loading}
          variant="outline"
          size="sm"
          className="gap-2 bg-background/20 border-white/20 text-white hover:bg-white/10"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Modern Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-white/70">Loading notifications...</p>
          </div>
        </div>
      ) : nearingMaturity.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
            <Bell className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No notifications
          </h3>
          <p className="text-brand-neutral mb-6">
            No bonds are nearing maturity at this time
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {nearingMaturity.map((bond) => (
            <div
              key={bond.bondID}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-brand-warning/40 hover:border-brand-warning/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-warning/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-warning/10 via-transparent to-brand-primary/10" />
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-warning to-brand-primary flex items-center justify-center shadow-lg">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Bond #{bond.bondID}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs px-2 py-1 bg-brand-warning/20 text-brand-warning border-brand-warning/40">
                        <Bell className="w-3 h-3 mr-1" />
                        Nearing Maturity
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="text-xs text-white/70 mb-1">💰 Principal</div>
                    <div className="text-lg font-bold text-white">
                      {bondRedemptionService.formatCurrency(bond.principal)}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="text-xs text-white/70 mb-1">📈 Expected Yield</div>
                    <div className="text-lg font-bold text-brand-primary">
                      {bondRedemptionService.formatCurrency(bond.expectedYield)}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="text-xs text-white/70 mb-1">⏰ Time Left</div>
                    <div className="text-sm font-medium text-white">
                      {bondRedemptionService.formatTimeRemaining(bond.timeUntilMaturity)}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <div className="text-xs text-white/70 mb-1">📅 Maturity Date</div>
                    <div className="text-sm font-medium text-white">
                      {bondRedemptionService.formatDate(bond.maturityDate)}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="text-xs text-white/70 mb-1">💎 Expected Total</div>
                  <div className="text-lg font-bold text-brand-warning">
                    {bondRedemptionService.formatCurrency(bond.expectedTotal)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
