"use client";

import { type RedeemTabNavigationProps } from "@/types/redeem.types";
import { DollarSign, Clock, Bell, RefreshCw } from "lucide-react";

export const RedeemTabNavigation = ({
  activeTab,
  onTabChange,
  redeemableBonds,
  pendingBonds,
  nearingMaturity,
  scheduledBondsCount = 0,
}: RedeemTabNavigationProps) => {
  return (
    <div className="reveal-item">
      <div className="relative">
        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center gap-2 p-2 backdrop-blur-xl rounded-2xl border border-semantic-border">
          {[
            {
              key: "redeemable",
              label: "Ready to Redeem",
              Icon: DollarSign,
              count: redeemableBonds.length,
              badgeBg: "bg-brand-accent/20",
              badgeText: "text-brand-accent",
            },
            {
              key: "pending",
              label: "Pending Bonds",
              Icon: Clock,
              count: pendingBonds.length,
              badgeBg: "bg-brand-primary/20",
              badgeText: "text-brand-primary",
            },
            {
              key: "notifications",
              label: "Notifications",
              Icon: Bell,
              count: nearingMaturity.length,
              badgeBg: "bg-brand-warning/20",
              badgeText: "text-brand-warning",
            },
            ...(scheduledBondsCount > 0 ? [{
              key: "scheduled",
              label: "Auto-Reinvesting",
              Icon: RefreshCw,
              count: scheduledBondsCount,
              badgeBg: "bg-green-500/20",
              badgeText: "text-green-400",
            }] : []),
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                onTabChange(
                  tab.key as "redeemable" | "pending" | "notifications" | "scheduled"
                )
              }
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-brand-900 text-white shadow-lg border border-brand-primary/50"
                  : "text-white/70 hover:text-white border border-white/20 hover:border-white/40"
              }`}
            >
              <tab.Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                    activeTab === tab.key
                      ? "bg-white text-gray-700"
                      : `${tab.badgeBg} ${tab.badgeText}`
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mobile navigation */}
        <div className="sm:hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              {
                key: "redeemable",
                label: "Ready",
                Icon: DollarSign,
                count: redeemableBonds.length,
                badgeBg: "bg-brand-accent/20",
                badgeText: "text-brand-accent",
              },
              {
                key: "pending",
                label: "Pending",
                Icon: Clock,
                count: pendingBonds.length,
                badgeBg: "bg-brand-primary/20",
                badgeText: "text-brand-primary",
              },
              {
                key: "notifications",
                label: "Alerts",
                Icon: Bell,
                count: nearingMaturity.length,
                badgeBg: "bg-brand-warning/20",
                badgeText: "text-brand-warning",
              },
              ...(scheduledBondsCount > 0 ? [{
                key: "scheduled",
                label: "Auto",
                Icon: RefreshCw,
                count: scheduledBondsCount,
                badgeBg: "bg-green-500/20",
                badgeText: "text-green-400",
              }] : []),
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  onTabChange(
                    tab.key as "redeemable" | "pending" | "notifications" | "scheduled"
                  )
                }
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-brand-900 text-white shadow-lg border border-brand-primary/50"
                    : "text-white/70 hover:text-white border border-white/20 hover:border-white/40"
                }`}
              >
                <tab.Icon className="w-4 h-4" />
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
