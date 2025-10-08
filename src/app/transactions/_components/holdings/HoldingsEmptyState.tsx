"use client";

import { Button } from "@/components/ui/button";
import { Clock, TrendingUp } from "lucide-react";

interface HoldingsEmptyStateProps {
  onMintBond?: () => void;
}

export const HoldingsEmptyState = ({ onMintBond }: HoldingsEmptyStateProps) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
        <Clock className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        No bonds found
      </h3>
      <p className="text-brand-neutral mb-6">
        Start by minting your first bond to see it here
      </p>
      <Button 
        variant="outline"
        className="bg-background/20 border-white/20 text-white hover:bg-white/10"
        onClick={onMintBond}
      >
        <TrendingUp className="mr-2 h-4 w-4" />
        Mint Your First Bond
      </Button>
    </div>
  );
};
