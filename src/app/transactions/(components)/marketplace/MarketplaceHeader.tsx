"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { type MarketplaceHeaderProps } from "@/types/marketplace.types";

export const MarketplaceHeader = ({ activeTab, onRefresh, loading }: MarketplaceHeaderProps) => {
  const getHeaderContent = () => {
    switch (activeTab) {
      case "buy":
        return {
          title: "🛒 Available Bonds",
          description: "Browse and purchase bonds listed by other users"
        };
      case "sell":
        return {
          title: "💰 List Your Bonds for Sale",
          description: "List your bonds for sale on the marketplace"
        };
      case "manage":
        return {
          title: "📊 Manage Your Listings",
          description: "Manage your active bond listings"
        };
      default:
        return {
          title: "Marketplace",
          description: "ChronoBond Marketplace"
        };
    }
  };

  const { title, description } = getHeaderContent();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {title}
        </h2>
        <p className="text-white/70">
          {description}
        </p>
      </div>
      <Button
        onClick={onRefresh}
        variant="outline"
        size="sm"
        className="gap-2 bg-background/20 border-white/20 text-white hover:bg-white/10"
        disabled={loading}
      >
        <RefreshCw
          className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
        />
        Refresh
      </Button>
    </div>
  );
};
