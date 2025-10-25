"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Tag, 
  DollarSign, 
  CheckCircle,
  Link as LinkIcon
} from "lucide-react";
import { type BondCardProps } from "@/types/holding.types";

export const HoldingsBondCard = ({
  bond,
  onListBond,
  onRedeemBond,
  isMatured,
  formatFlow,
  formatDate,
  calculateCurrentYield
}: BondCardProps) => {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border transition-all duration-300 hover:shadow-lg ${
      isMatured 
        ? 'border-brand-accent/40 hover:border-brand-accent/60 hover:shadow-brand-accent/10' 
        : 'border-brand-primary/40 hover:border-brand-primary/60 hover:shadow-brand-primary/10'
    }`}>
      <div className={`absolute inset-0 ${
        isMatured 
          ? 'bg-gradient-to-br from-brand-accent/10 via-transparent to-brand-primary/10' 
          : 'bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/10'
      }`} />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg ${
            isMatured 
              ? 'from-brand-accent to-brand-primary' 
              : 'from-brand-primary to-brand-accent'
          }`}>
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bond #{bond.id}</h3>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs px-2 py-1 ${
                isMatured 
                  ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/40' 
                  : 'bg-brand-primary/20 text-brand-primary border-brand-primary/40'
              }`}>
                {isMatured ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Matured
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Active
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">💰 Principal</div>
            <div className="text-lg font-bold text-white">{formatFlow(bond.principal)}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">📈 Yield Rate</div>
            <div className="text-lg font-bold text-brand-primary">{(bond.yieldRate * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">⚡ Strategy</div>
            <div className="text-sm font-medium text-white">{bond.strategyID}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">📅 Maturity</div>
            <div className="text-sm font-medium text-white">{formatDate(bond.maturityDate)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">📊 Expected Yield</div>
            <div className="text-lg font-bold text-brand-accent">{formatFlow(calculateCurrentYield(bond))}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">💎 Total Value</div>
            <div className="text-lg font-bold text-brand-accent">{formatFlow(bond.principal + calculateCurrentYield(bond))}</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {!isMatured && (
            <Button
              onClick={onListBond}
              className="bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg w-full sm:w-auto"
              size="lg"
            >
              <Tag className="w-4 h-4 mr-2" />
              List for Sale
            </Button>
          )}
          {isMatured && (
            <Button
              onClick={onRedeemBond}
              className="bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg w-full sm:w-auto"
              size="lg"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Redeem Bond
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
