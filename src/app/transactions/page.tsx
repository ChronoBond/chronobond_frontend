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
import {
  BackgroundGrid,
  BackgroundDots,
} from "@/components/ui/background-grid";
import { Coins, ShoppingCart, Clock, Shield, Menu, X } from "lucide-react";

// Import the main components
import MintMain from "@/app/transactions/(components)/mint/MintMain";
import HoldingsMain from "@/app/transactions/(components)/holdings/HoldingsMain";
import MarketplaceMain from "@/app/transactions/(components)/marketplace/MarketplaceMain";
import RedeemMain from "@/app/transactions/(components)/redeem/RedeemMain";

type TransactionTabType = "mint" | "holdings" | "marketplace" | "redeem";

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<TransactionTabType>("mint");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileMenu]);

  // Tab transition animations
  useEffect(() => {
    if (tabContentRef.current) {
      // Reset and animate in
      gsap.set(tabContentRef.current, { opacity: 0, y: 20 });
      gsap.to(tabContentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [activeTab]);

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
    setActiveTab(tab);
    setShowMobileMenu(false);
  };

  const openMobileMenu = () => {
    setShowMobileMenu(true);
  };

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
    <div className="min-h-screen bg-black text-white">
      {/* Floating Navbar */}
      <FloatingNavbar />

      {/* Main Content */}
      <div className="relative pt-16 sm:pt-20 min-h-screen">
        <BackgroundDots className="absolute inset-0 dot-bg">
          <div className="absolute inset-0" />
        </BackgroundDots>
        <BackgroundGrid className="absolute inset-0 grid-bg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 backdrop-blur-sm" />
        </BackgroundGrid>

        <div className="transactions-content relative z-10 mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          {/* Navigation Tabs */}
          <div className="mb-12 relative">
            {/* Mobile Menu Button */}
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

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center justify-center">
              <div className="flex space-x-1 rounded-full frosted-glass p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      variant={activeTab === tab.id ? "gradient" : "ghost"}
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

            {/* Mobile Menu Modal */}
            {showMobileMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden mobile-menu-backdrop"
                  onClick={() => setShowMobileMenu(false)}
                />

                {/* Mobile Menu */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden">
                  <div className="w-full max-w-sm">
                    <GlassCard className="mobile-menu-card overflow-hidden frosted-glass">
                      <GlassCardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <GlassCardTitle className="text-base font-semibold">
                              Transaction Menu
                            </GlassCardTitle>
                            <GlassCardDescription className="text-xs mt-0.5">
                              Currently viewing:{" "}
                              {tabs.find((tab) => tab.id === activeTab)?.label}
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
                                  activeTab === tab.id ? "gradient" : "ghost"
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

          {/* Tab Content */}
          <div ref={tabContentRef}>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
