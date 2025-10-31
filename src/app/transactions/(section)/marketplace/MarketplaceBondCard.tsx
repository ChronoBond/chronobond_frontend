"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tag,
  Loader2,
  Link as LinkIcon,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { type MarketplaceBondCardProps } from "@/types/marketplace.types";
import { useEffect, useState } from "react";

export const MarketplaceBondCard = ({
  bond,
  listingPrice,
  onPriceChange,
  onListBond,
  isListing,
  formatFlow,
  formatDate,
  calculateCurrentYield,
}: MarketplaceBondCardProps) => {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    // update once a minute
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const bondIsMatured = now / 1000 >= bond.maturityDate;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-semantic-surface backdrop-blur-xl border border-semantic-border transition-all duration-300 hover:shadow-lg ${
        bondIsMatured
          ? "hover:border-brand-accent"
          : "hover:border-brand-primary"
      }`}
    >
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg`}
          >
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bond #{bond.id}</h3>
            <div className="flex items-center gap-2">
              <Badge
                className={`text-xs px-2 py-1 ${
                  bondIsMatured
                    ? "bg-brand-accent/20 text-brand-accent border-brand-accent/40"
                    : "bg-brand-primary/20 text-brand-primary border-brand-primary/40"
                }`}
              >
                {bondIsMatured ? (
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
            <div className="text-lg font-bold text-white">
              {formatFlow(bond.principal)}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Yield Rate</div>
            <div className="text-lg font-bold text-brand-primary">
              {(bond.yieldRate * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Strategy</div>
            <div className="text-sm font-medium text-white">
              {bond.strategyID}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Maturity</div>
            <div className="text-sm font-medium text-white">
              {formatDate(bond.maturityDate)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Expected Yield</div>
            <div className="text-lg font-bold text-brand-accent">
              {formatFlow(calculateCurrentYield(bond))}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">Total Value</div>
            <div className="text-lg font-bold text-brand-accent">
              {formatFlow(bond.principal + calculateCurrentYield(bond))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">
              Listing Price (FLOW)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
              <Input
                type="number"
                placeholder="Enter price"
                value={listingPrice}
                onChange={(e) => onPriceChange(bond.id, e.target.value)}
                min="0"
                step="0.01"
                className="pl-10 pr-16 bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-white/70 bg-white/10 px-2 py-1 rounded">
                FLOW
              </div>
            </div>
          </div>

          <Button
            onClick={() => onListBond(bond.id, listingPrice)}
            disabled={
              isListing ||
              !listingPrice ||
              parseFloat(listingPrice) <= 0 ||
              isNaN(parseFloat(listingPrice))
            }
            className="w-full bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg"
            size="lg"
          >
            {isListing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Listing...
              </>
            ) : (
              <>
                <Tag className="w-4 h-4 mr-2" />
                List for Sale
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
