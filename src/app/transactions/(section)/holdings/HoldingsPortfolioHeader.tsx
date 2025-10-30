"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface HoldingsPortfolioHeaderProps {
  onRefresh: () => void;
}

export const HoldingsPortfolioHeader = ({ onRefresh }: HoldingsPortfolioHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Bond Portfolio
        </h2>
        <p className="text-white/70">
          Manage your time-locked bonds and list them for sale on the marketplace
        </p>
      </div>
      <Button 
        onClick={onRefresh}
        variant="outline"
        size="sm"
        className="gap-2 bg-background/20 border-white/20 text-white hover:bg-white/10"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh
      </Button>
    </div>
  );
};
