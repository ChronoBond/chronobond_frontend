"use client";

import { type RedeemTabNavigationProps } from "@/types/redeem.types";

export const RedeemTabNavigation = ({ 
  activeTab, 
  onTabChange, 
  redeemableBonds, 
  pendingBonds, 
  nearingMaturity 
}: RedeemTabNavigationProps) => {
  return (
    <div className="reveal-item">
      <div className="relative">
        {/* Desktop: Horizontal Pills */}
        <div className="hidden sm:flex items-center gap-2 p-2 bg-background/20 backdrop-blur-xl rounded-2xl border border-white/10">
          {[
            {
              key: "redeemable",
              label: "Ready to Redeem",
              icon: "💰",
              count: redeemableBonds.length,
              badgeBg: "bg-brand-accent/20",
              badgeText: "text-brand-accent",
            },
            {
              key: "pending",
              label: "Pending Bonds",
              icon: "⏳",
              count: pendingBonds.length,
              badgeBg: "bg-brand-primary/20",
              badgeText: "text-brand-primary",
            },
            {
              key: "notifications",
              label: "Notifications",
              icon: "🔔",
              count: nearingMaturity.length,
              badgeBg: "bg-brand-warning/20",
              badgeText: "text-brand-warning",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key as "redeemable" | "pending" | "notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 text-white shadow-lg border border-brand-primary/30"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                    activeTab === tab.key
                      ? "bg-white text-brand-primary"
                      : `${tab.badgeBg} ${tab.badgeText}`
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mobile: Scrollable Pills */}
        <div className="sm:hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              {
                key: "redeemable",
                label: "Ready",
                icon: "💰",
                count: redeemableBonds.length,
                badgeBg: "bg-brand-accent/20",
                badgeText: "text-brand-accent",
              },
              {
                key: "pending",
                label: "Pending",
                icon: "⏳",
                count: pendingBonds.length,
                badgeBg: "bg-brand-primary/20",
                badgeText: "text-brand-primary",
              },
              {
                key: "notifications",
                label: "Alerts",
                icon: "🔔",
                count: nearingMaturity.length,
                badgeBg: "bg-brand-warning/20",
                badgeText: "text-brand-warning",
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key as "redeemable" | "pending" | "notifications")}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 text-white shadow-lg border border-brand-primary/30"
                    : "bg-background/20 text-white/70 hover:text-white hover:bg-white/5 border border-white/10"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                      activeTab === tab.key
                        ? "bg-white text-brand-primary"
                        : `${tab.badgeBg} ${tab.badgeText}`
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
