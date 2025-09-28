"use client";

import { ShoppingCart, Tag, Users } from "lucide-react";
import { type MarketplaceEmptyStateProps } from "@/types/marketplace.types";

export const MarketplaceEmptyState = ({ activeTab, onRefresh }: MarketplaceEmptyStateProps) => {
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case "buy":
        return {
          icon: <ShoppingCart className="w-10 h-10 text-muted-foreground" />,
          title: "No bonds available",
          description: "Be the first to list a bond for sale in the Sell tab!",
          showRefresh: true
        };
      case "sell":
        return {
          icon: <Tag className="w-10 h-10 text-muted-foreground" />,
          title: "No bonds to sell",
          description: "You don't have any bonds available for listing. Mint some bonds first!",
          showRefresh: true
        };
      case "manage":
        return {
          icon: <Users className="w-10 h-10 text-muted-foreground" />,
          title: "No active listings",
          description: "You don't have any active listings. List some bonds in the Sell tab!",
          showRefresh: true
        };
      default:
        return {
          icon: <ShoppingCart className="w-10 h-10 text-muted-foreground" />,
          title: "No data available",
          description: "No data to display",
          showRefresh: true
        };
    }
  };

  const { icon, title, description, showRefresh } = getEmptyStateContent();

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-brand-neutral mb-6">
        {description}
      </p>
      {showRefresh && (
        <button
          onClick={onRefresh}
          className="bg-background/20 border-white/20 text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
        >
          Refresh
        </button>
      )}
    </div>
  );
};
