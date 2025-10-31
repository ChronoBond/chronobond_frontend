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
    <div className={`group relative overflow-hidden rounded-2xl bg-semantic-surface backdrop-blur-xl border border-semantic-border transition-all duration-300 hover:shadow-lg ${
      isMatured 
        ? 'hover:border-brand-accent' 
        : 'hover:border-brand-primary'
    }`}>
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg`}>
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
            <div className="text-xs text-white/70 mb-1">Principal</div>
            <div className="text-lg font-bold text-white">{formatFlow(bond.principal)}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Yield Rate</div>
            <div className="text-lg font-bold text-brand-primary">{(bond.yieldRate * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Strategy</div>
            <div className="text-sm font-medium text-white">{bond.strategyID}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Maturity</div>
            <div className="text-sm font-medium text-white">{formatDate(bond.maturityDate)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Expected Yield</div>
            <div className="text-lg font-bold text-brand-accent">{formatFlow(calculateCurrentYield(bond))}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Total Value</div>
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
