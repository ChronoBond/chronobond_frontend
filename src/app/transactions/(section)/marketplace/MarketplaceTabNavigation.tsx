"use client";

import { ShoppingCart, Tag, Users } from "lucide-react";
import { type MarketplaceTabNavigationProps } from "@/types/marketplace.types";

export const MarketplaceTabNavigation = ({
  activeTab,
  onTabChange,
}: MarketplaceTabNavigationProps) => {
  return (
    <div className="space-y-4">
      {/* Desktop: Full Tab Cards */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4">
        {[
          {
            key: "buy",
            label: "Buy Bonds",
            desc: "Browse available bonds",
            icon: <ShoppingCart className="w-4 h-4" />,
            color: "brand-primary",
          },
          {
            key: "sell",
            label: "Sell Bonds",
            desc: "List your bonds for sale",
            icon: <Tag className="w-4 h-4" />,
            color: "brand-accent",
          },
          {
            key: "manage",
            label: "Manage Listings",
            desc: "Manage your active listings",
            icon: <Users className="w-4 h-4" />,
            color: "brand-warning",
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key as "buy" | "sell" | "manage")}
            className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === tab.key
                ? "!bg-brand-900 text-white shadow-lg border border-brand-primary/50"
                : "text-white/70 hover:text-white border border-white/20 hover:border-white/40"
            }`}
          >
            {activeTab === tab.key && (
              <div className="absolute inset-0 rounded-xl " />
            )}
            <span className="relative z-10">{tab.icon}</span>
            <div className="relative z-10 text-left">
              <div className="font-semibold">{tab.label}</div>
              <div className="text-xs opacity-80">{tab.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile: Scrollable Pills */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[
            {
              key: "buy",
              label: "Buy",
              icon: <ShoppingCart className="w-4 h-4" />,
              color: "brand-primary",
            },
            {
              key: "sell",
              label: "Sell",
              icon: <Tag className="w-4 h-4" />,
              color: "brand-accent",
            },
            {
              key: "manage",
              label: "Manage",
              icon: <Users className="w-4 h-4" />,
              color: "brand-warning",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key as "buy" | "sell" | "manage")}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-brand-900 text-white shadow-lg border border-brand-primary/50"
                  : "text-white/70 hover:text-white border border-white/20 hover:border-white/40"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
