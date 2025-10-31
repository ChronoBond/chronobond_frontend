"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RefreshCw, ShoppingBag, Tag, BarChart3 } from "lucide-react";
import { type MarketplaceHeaderProps } from "@/types/marketplace.types";

export const MarketplaceHeader = ({
  activeTab,
  onRefresh,
  loading,
}: MarketplaceHeaderProps) => {
  const getHeaderContent = () => {
    switch (activeTab) {
      case "buy":
        return {
          title: "Available Bonds",
          description: "Browse and purchase bonds listed by other users",
          icon: ShoppingBag,
          color: "bg-brand-primary",
        };
      case "sell":
        return {
          title: "List Your Bonds",
          description: "List your bonds for sale on the marketplace",
          icon: Tag,
          color: "bg-brand-accent",
        };
      case "manage":
        return {
          title: "Manage Listings",
          description: "Manage your active bond listings",
          icon: BarChart3,
          color: "bg-brand-warning",
        };
      default:
        return {
          title: "Marketplace",
          description: "ChronoBond Marketplace",
          icon: ShoppingBag,
          color: "bg-brand-primary",
        };
    }
  };

  const { title, description, icon: Icon, color } = getHeaderContent();

  return (
    <Card className="rounded-2xl bg-semantic-surface backdrop-blur-xl border border-semantic-border">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl ${color} bg-brand-900 flex items-center justify-center flex-shrink-0 shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <CardDescription className="text-base mt-1">
                {description}
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={onRefresh}
            variant="ghost"
            size="sm"
            className="gap-2 text-semantic-text-secondary hover:bg-semantic-border/50"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};
