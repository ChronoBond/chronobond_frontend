"use client";

import { Suspense, lazy } from "react";
import { useFlowCurrentUser } from "@onflow/kit";
import { useRedeem } from "./useRedeem";
import { LoadingState } from "@/components/ui/loading-state";

// Lazy load heavy sections to reduce initial bundle
const RedeemWalletPrompt = lazy(() => import("./RedeemWalletPrompt").then(module => ({ default: module.RedeemWalletPrompt })));
const RedeemHeader = lazy(() => import("./RedeemHeader").then(module => ({ default: module.RedeemHeader })));
const RedeemMessages = lazy(() => import("./RedeemMessages").then(module => ({ default: module.RedeemMessages })));
const RedeemTabNavigation = lazy(() => import("./RedeemTabNavigation").then(module => ({ default: module.RedeemTabNavigation })));
const RedeemableBonds = lazy(() => import("./RedeemableBonds").then(module => ({ default: module.RedeemableBonds })));
const PendingBonds = lazy(() => import("./PendingBonds").then(module => ({ default: module.PendingBonds })));
const Notifications = lazy(() => import("./Notifications").then(module => ({ default: module.Notifications })));
const RedeemModal = lazy(() => import("./RedeemModal").then(module => ({ default: module.RedeemModal })));

const RedeemMain = () => {
  const { user } = useFlowCurrentUser();
  
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
    redeemModalOpen,
    selectedBond,
    receiveToken,
    receiveQuote,
    quoteLoading,
    setActiveTab,
    loadBondData,
    handleRedeemBond,
    handleRedeemAllBonds,
    clearMessages,
    setRedeemModalOpen,
    setReceiveToken,
    confirmRedeem
  } = useRedeem();

  if (!user?.loggedIn) {
    return (
      <Suspense fallback={<LoadingState message="Loading wallet prompt..." />}>
        <RedeemWalletPrompt />
      </Suspense>
    );
  }

  if (loading) {
    return <LoadingState message="Loading your bond portfolio..." />;
  }

  return (
    <div className="app-container space-y-6 pb-8">
      {/* Modern Bond Redemption Header */}
      <Suspense fallback={<LoadingState message="Loading header..." />}>
        <RedeemHeader
          redeemableBonds={redeemableBonds}
          pendingBonds={pendingBonds}
          nearingMaturity={nearingMaturity}
          totalRedeemableValue={totalRedeemableValue}
        />
      </Suspense>

      {/* Messages */}
      <Suspense fallback={<LoadingState message="Loading messages..." />}>
        <RedeemMessages
          error={error}
          success={success}
          onClearMessages={clearMessages}
        />
      </Suspense>

      {/* Modern Tab Navigation */}
      <Suspense fallback={<LoadingState message="Loading navigation..." />}>
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
        <Suspense fallback={<LoadingState message="Loading redeemable bonds..." />}>
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

      {/* Redeem Modal */}
      <Suspense fallback={null}>
        <RedeemModal
          open={Boolean(redeemModalOpen)}
          onClose={() => (setRedeemModalOpen ? setRedeemModalOpen(false) : undefined)}
          bond={selectedBond ?? null}
          receiveToken={(receiveToken ?? "FLOW") as "FLOW" | "USDC"}
          onReceiveTokenChange={setReceiveToken || (() => {})}
          receiveQuote={receiveQuote ?? null}
          quoteLoading={Boolean(quoteLoading)}
          isRedeeming={selectedBond ? redeeming[selectedBond.bondID] : false}
          onConfirm={confirmRedeem || (() => {})}
        />
      </Suspense>

      {activeTab === "pending" && (
        <Suspense fallback={<LoadingState message="Loading pending bonds..." />}>
          <PendingBonds
            pendingBonds={pendingBonds}
            loading={loading}
            onRefresh={loadBondData}
          />
        </Suspense>
      )}

      {activeTab === "notifications" && (
        <Suspense fallback={<LoadingState message="Loading notifications..." />}>
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