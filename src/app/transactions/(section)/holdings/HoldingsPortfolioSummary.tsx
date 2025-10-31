"use client";

import { TrendingUp, DollarSign, Link as LinkIcon } from "lucide-react";
import { type PortfolioSummaryProps } from "@/types/holding.types";

export const HoldingsPortfolioSummary = ({ bonds, formatFlow, calculateCurrentYield }: PortfolioSummaryProps) => {
  const totalValue = bonds.reduce((sum, bond) => sum + bond.principal, 0);
  const totalYield = bonds.reduce((sum, bond) => sum + calculateCurrentYield(bond), 0);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-semantic-surface backdrop-blur-xl border border-semantic-border p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-semantic-text">
              My Holdings
            </h1>
            <p className="text-brand-neutral text-lg">
              Your ChronoBond portfolio overview
            </p>
          </div>
        </div>
        
        {/* Modern Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                <LinkIcon className="w-4 h-4 text-brand-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{bonds.length}</div>
                <div className="text-sm text-brand-neutral">Total Bonds</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-brand-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-accent">{formatFlow(totalValue)}</div>
                <div className="text-sm text-brand-neutral">Total Principal</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-warning/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-brand-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-warning">{formatFlow(totalYield)}</div>
                <div className="text-sm text-brand-neutral">Expected Yield</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
