"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FloatingNavbar } from "@/components/floating-navbar";
import { Button } from "@/components/ui/button";
import {
  GlassCard,
  GlassCardContent,
  GlassCardDescription,
  GlassCardHeader,
  GlassCardTitle,
} from "@/components/ui/glass-card";
import { Coins, ShoppingCart, Clock, Shield, Menu, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Import the main components
import MintMain from "@/app/transactions/(section)/mint/MintMain";
import HoldingsMain from "@/app/transactions/(section)/holdings/HoldingsMain";
import MarketplaceMain from "@/app/transactions/(section)/marketplace/MarketplaceMain";
import RedeemMain from "@/app/transactions/(section)/redeem/RedeemMain";
import { BackgroundGrid } from "@/components/ui/background-grid";

type TransactionTabType = "mint" | "holdings" | "marketplace" | "redeem";

export default function TransactionsPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("modal-open");
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.classList.remove("modal-open");
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.classList.remove("modal-open");
    };
  }, [showMobileMenu]);

  useEffect(() => {
    if (tabContentRef.current) {
      gsap.set(tabContentRef.current, { opacity: 0, y: 20 });
      gsap.to(tabContentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, []);

  const tabs = [
    { id: "mint" as TransactionTabType, label: "Mint Bonds", icon: Coins },
    { id: "holdings" as TransactionTabType, label: "My Holdings", icon: Clock },
    {
      id: "marketplace" as TransactionTabType,
      label: "Marketplace",
      icon: ShoppingCart,
    },
    { id: "redeem" as TransactionTabType, label: "Redeem Bonds", icon: Shield },
  ];

  const handleTabChange = (tab: TransactionTabType) => {
    setShowMobileMenu(false);

    // preserve other params while updating `tab`
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("tab", tab);
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
  };
  const activeTab: TransactionTabType =
    (searchParams?.get("tab") as TransactionTabType) || "mint";

  const openMobileMenu = () => {
    setShowMobileMenu(true);
  };

  useEffect(() => {
    if (tabContentRef.current) {
      gsap.set(tabContentRef.current, { opacity: 0, y: 20 });
      gsap.to(tabContentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "mint":
        return <MintMain />;
      case "holdings":
        return <HoldingsMain />;
      case "marketplace":
        return <MarketplaceMain />;
      case "redeem":
        return <RedeemMain />;
      default:
        return <MintMain />;
    }
  };

  return (
    <div className="min-h-screen bg-[#001531] text-[var(--color-text)]">
      <FloatingNavbar />
      <BackgroundGrid className="absolute inset-0">
        <p></p>
      </BackgroundGrid>

      <div className="relative pt-16 sm:pt-20 min-h-screen">
        {/* Subtle grid lines background (no gradient clipping) */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            opacity: 0.34,
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.16) 0, rgba(255,255,255,0.16) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.16) 0, rgba(255,255,255,0.16) 1px, transparent 1px, transparent 20px)",
          }}
        />
        {/* Coarse grid overlay to strengthen visibility */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            opacity: 0.15,
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 80px)",
          }}
        />

        <div className="transactions-content-wrapper relative z-10 min-h-screen">
          <div className="transactions-content relative mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 pointer-events-auto">
            <div className="mb-12 relative">
              <div className="md:hidden flex items-center justify-center mb-4">
                <Button
                  ref={menuButtonRef}
                  onClick={openMobileMenu}
                  variant="glass"
                  size="lg"
                  className="rounded-full px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Menu className="mr-2 h-5 w-5" />
                  <span className="font-medium">
                    {tabs.find((tab) => tab.id === activeTab)?.label || "Menu"}
                  </span>
                </Button>
              </div>

              <nav className="hidden md:flex items-center justify-center">
                <div className="flex space-x-1 rounded-full frosted-glass p-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        variant={activeTab === tab.id ? "primary" : "ghost"}
                        className={`
                        relative flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap
                        ${
                          activeTab === tab.id
                            ? "text-white shadow-lg"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }
                      `}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                        {activeTab === tab.id && (
                          <div
                            className="absolute inset-0 rounded-full bg-primary"
                            style={{ zIndex: -1 }}
                          />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </nav>

              {showMobileMenu && (
                <>
                  <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 md:hidden mobile-menu-backdrop"
                    onClick={() => setShowMobileMenu(false)}
                  />

                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden">
                    <div className="w-full max-w-sm">
                      <GlassCard className="mobile-menu-card overflow-hidden frosted-glass border border-white/20 bg-gradient-to-br from-background/95 via-background/85 to-background/80 backdrop-blur-md shadow-2xl">
                        <GlassCardHeader className="pb-3 border-b border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <GlassCardTitle className="text-base font-semibold">
                                Transaction Menu
                              </GlassCardTitle>
                              <GlassCardDescription className="text-xs mt-0.5">
                                Currently viewing:{" "}
                                {
                                  tabs.find((tab) => tab.id === activeTab)
                                    ?.label
                                }
                              </GlassCardDescription>
                            </div>
                            <Button
                              onClick={() => setShowMobileMenu(false)}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-full hover:bg-white/10 text-white"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </GlassCardHeader>
                        <GlassCardContent className="pt-0">
                          <div className="space-y-2">
                            {tabs.map((tab) => {
                              const Icon = tab.icon;
                              return (
                                <Button
                                  key={tab.id}
                                  onClick={() => handleTabChange(tab.id)}
                                  variant={
                                    activeTab === tab.id ? "primary" : "ghost"
                                  }
                                  className={`
                                  w-full justify-start gap-3 rounded-lg px-4 py-3 text-left transition-all duration-200
                                  ${
                                    activeTab === tab.id
                                      ? "text-white"
                                      : "text-white/70 hover:text-white hover:bg-white/10"
                                  }
                                `}
                                >
                                  <Icon className="h-4 w-4" />
                                  {tab.label}
                                </Button>
                              );
                            })}
                          </div>
                        </GlassCardContent>
                      </GlassCard>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div ref={tabContentRef}>{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
