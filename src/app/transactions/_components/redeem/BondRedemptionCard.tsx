"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  DollarSign, 
  Link as LinkIcon, 
  CheckCircle 
} from "lucide-react";
import { bondRedemptionService } from "@/lib/bond-redemption-service";
import { type BondRedemptionCardProps } from "@/types/redeem.types";

export const BondRedemptionCard = ({ 
  bond, 
  onRedeem, 
  isRedeeming 
}: BondRedemptionCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-brand-accent/40 hover:border-brand-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/10">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 via-transparent to-brand-primary/10" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center shadow-lg">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bond #{bond.bondID}</h3>
            <div className="flex items-center gap-2">
              <Badge className="text-xs px-2 py-1 bg-brand-accent/20 text-brand-accent border-brand-accent/40">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ready to Redeem
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
            <div className="text-xs text-white/70 mb-1">📅 Maturity Date</div>
            <div className="text-sm font-medium text-white">
              {bondRedemptionService.formatDate(bond.maturityDate)}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">💎 Expected Total</div>
            <div className="text-lg font-bold text-brand-warning">
              {bondRedemptionService.formatCurrency(bond.expectedTotal)}
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => onRedeem(bond)}
          disabled={isRedeeming}
          className="w-full bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg"
          size="lg"
        >
          {isRedeeming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Redeeming...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Redeem Bond
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
