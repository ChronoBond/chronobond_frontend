"use client";

import { Suspense, lazy, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useFlowCurrentUser } from "@onflow/kit";
import { useRedeem } from "./useRedeem";

// Lazy load components for better performance
const RedeemWalletPrompt = lazy(() => import("./RedeemWalletPrompt").then(module => ({ default: module.RedeemWalletPrompt })));
const RedeemHeader = lazy(() => import("./RedeemHeader").then(module => ({ default: module.RedeemHeader })));
const RedeemMessages = lazy(() => import("./RedeemMessages").then(module => ({ default: module.RedeemMessages })));
const RedeemTabNavigation = lazy(() => import("./RedeemTabNavigation").then(module => ({ default: module.RedeemTabNavigation })));
const RedeemableBonds = lazy(() => import("./RedeemableBonds").then(module => ({ default: module.RedeemableBonds })));
const PendingBonds = lazy(() => import("./PendingBonds").then(module => ({ default: module.PendingBonds })));
const Notifications = lazy(() => import("./Notifications").then(module => ({ default: module.Notifications })));

const RedeemMain = () => {
  const { user } = useFlowCurrentUser();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    activeTab,
    redeemableBonds,
    pendingBonds,
    nearingMaturity,
    totalRedeemableValue,
    loading,
    error,
    success,
    redeeming,
    setActiveTab,
    loadBondData,
    handleRedeemBond,
    handleRedeemAllBonds,
    clearMessages
  } = useRedeem();

  // Reveal animation when component mounts
  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll(".reveal-item");
    if (elements && elements.length > 0) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // Tab switching animation
  useEffect(() => {
    const tabContent = containerRef.current?.querySelector(".tab-content");
    if (tabContent) {
      gsap.fromTo(
        tabContent,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [activeTab]);

  if (!user?.loggedIn) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <RedeemWalletPrompt />
      </Suspense>
    );
  }

  return (
    <div ref={containerRef} className="app-container space-y-6 pb-8">
      {/* Modern Bond Redemption Header */}
      <Suspense fallback={<div>Loading header...</div>}>
        <RedeemHeader
          redeemableBonds={redeemableBonds}
          pendingBonds={pendingBonds}
          nearingMaturity={nearingMaturity}
          totalRedeemableValue={totalRedeemableValue}
        />
      </Suspense>

      {/* Messages */}
      <Suspense fallback={<div>Loading messages...</div>}>
        <RedeemMessages
          error={error}
          success={success}
          onClearMessages={clearMessages}
        />
      </Suspense>

      {/* Modern Tab Navigation */}
      <Suspense fallback={<div>Loading navigation...</div>}>
        <RedeemTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          redeemableBonds={redeemableBonds}
          pendingBonds={pendingBonds}
          nearingMaturity={nearingMaturity}
        />
      </Suspense>

      {/* Tab Content */}
      {activeTab === "redeemable" && (
        <Suspense fallback={<div>Loading redeemable bonds...</div>}>
          <RedeemableBonds
            redeemableBonds={redeemableBonds}
            loading={loading}
            redeeming={redeeming}
            totalRedeemableValue={totalRedeemableValue}
            onRefresh={loadBondData}
            onRedeemBond={handleRedeemBond}
            onRedeemAllBonds={handleRedeemAllBonds}
          />
        </Suspense>
      )}

      {activeTab === "pending" && (
        <Suspense fallback={<div>Loading pending bonds...</div>}>
          <PendingBonds
            pendingBonds={pendingBonds}
            loading={loading}
            onRefresh={loadBondData}
          />
        </Suspense>
      )}

      {activeTab === "notifications" && (
        <Suspense fallback={<div>Loading notifications...</div>}>
          <Notifications
            nearingMaturity={nearingMaturity}
            loading={loading}
            onRefresh={loadBondData}
          />
        </Suspense>
      )}
    </div>
  );
};

export default RedeemMain;