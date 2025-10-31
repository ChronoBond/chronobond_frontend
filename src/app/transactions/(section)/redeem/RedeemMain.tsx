"use client";

import { Suspense, lazy, useState } from "react";
import { useFlowCurrentUser } from "@onflow/kit";
import { useRedeem } from "./useRedeem";
import { LoadingState } from "@/components/ui/loading-state";
import { type BondDetails } from "@/lib/chronobond-service";
import { bondRedemptionService } from "@/lib/bond-redemption-service";
import { toast } from "@/hooks/use-toast";

// Lazy load heavy sections to reduce initial bundle
const RedeemWalletPrompt = lazy(() =>
  import("./RedeemWalletPrompt").then((module) => ({
    default: module.RedeemWalletPrompt,
  }))
);
const RedeemHeader = lazy(() =>
  import("./RedeemHeader").then((module) => ({ default: module.RedeemHeader }))
);
const RedeemMessages = lazy(() =>
  import("./RedeemMessages").then((module) => ({
    default: module.RedeemMessages,
  }))
);
const RedeemTabNavigation = lazy(() =>
  import("./RedeemTabNavigation").then((module) => ({
    default: module.RedeemTabNavigation,
  }))
);
const RedeemableBonds = lazy(() =>
  import("./RedeemableBonds").then((module) => ({
    default: module.RedeemableBonds,
  }))
);
const PendingBonds = lazy(() =>
  import("./PendingBonds").then((module) => ({ default: module.PendingBonds }))
);
const Notifications = lazy(() =>
  import("./Notifications").then((module) => ({
    default: module.Notifications,
  }))
);
const RedeemModal = lazy(() =>
  import("./RedeemModal").then((module) => ({ default: module.RedeemModal }))
);
const ReinvestModal = lazy(() =>
  import("./ReinvestModal").then((module) => ({
    default: module.ReinvestModal,
  }))
);

const RedeemMain = () => {
  const { user } = useFlowCurrentUser();
  const [reinvestModalOpen, setReinvestModalOpen] = useState(false);
  const [selectedBondForReinvest, setSelectedBondForReinvest] =
    useState<BondDetails | null>(null);
  const [isReinvesting, setIsReinvesting] = useState(false);

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
    confirmRedeem,
  } = useRedeem();

  // Handle reinvest button click
  const handleReinvestClick = (bond: BondDetails) => {
    setSelectedBondForReinvest(bond);
    setReinvestModalOpen(true);
  };

  // Handle reinvest confirmation
  const handleReinvestConfirm = async (
    duration: number,
    yieldRate: number,
    strategyID: string
  ) => {
    if (!selectedBondForReinvest) return;

    if (!user?.loggedIn) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsReinvesting(true);
      const result = await bondRedemptionService.reinvestBond(
        selectedBondForReinvest.bondID.toString(),
        duration,
        yieldRate,
        strategyID,
        user.addr
      );

      if (result.success) {
        toast({
          title: "🔄 Bond Reinvested",
          description: `Bond #${selectedBondForReinvest.bondID} reinvested successfully for ${duration} days`,
          variant: "default",
        });

        // Refresh bond data
        await loadBondData();
        setReinvestModalOpen(false);
        setSelectedBondForReinvest(null);
      } else {
        throw new Error(result.error || "Reinvest failed");
      }
    } catch (err: unknown) {
      toast({
        title: "Reinvest Failed",
        description:
          err instanceof Error ? err.message : "Failed to reinvest bond",
        variant: "destructive",
      });
    } finally {
      setIsReinvesting(false);
    }
  };

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
        <Suspense
          fallback={<LoadingState message="Loading redeemable bonds..." />}
        >
          <RedeemableBonds
            redeemableBonds={redeemableBonds}
            loading={loading}
            redeeming={redeeming}
            totalRedeemableValue={totalRedeemableValue}
            onRefresh={loadBondData}
            onRedeemBond={handleRedeemBond}
            onRedeemAllBonds={handleRedeemAllBonds}
            onReinvestBond={handleReinvestClick}
          />
        </Suspense>
      )}

      {/* Redeem Modal */}
      <Suspense fallback={null}>
        <RedeemModal
          open={Boolean(redeemModalOpen)}
          onClose={() =>
            setRedeemModalOpen ? setRedeemModalOpen(false) : undefined
          }
          bond={selectedBond ?? null}
          receiveToken={(receiveToken ?? "FLOW") as "FLOW" | "USDC"}
          onReceiveTokenChange={setReceiveToken || (() => {})}
          receiveQuote={receiveQuote ?? null}
          quoteLoading={Boolean(quoteLoading)}
          isRedeeming={selectedBond ? redeeming[selectedBond.bondID] : false}
          onConfirm={confirmRedeem || (() => {})}
        />
      </Suspense>

      {/* Reinvest Modal */}
      <Suspense fallback={null}>
        <ReinvestModal
          isOpen={reinvestModalOpen}
          bond={selectedBondForReinvest}
          isReinvesting={isReinvesting}
          onClose={() => {
            setReinvestModalOpen(false);
            setSelectedBondForReinvest(null);
          }}
          onConfirm={handleReinvestConfirm}
        />
      </Suspense>

      {activeTab === "pending" && (
        <Suspense
          fallback={<LoadingState message="Loading pending bonds..." />}
        >
          <PendingBonds
            pendingBonds={pendingBonds}
            loading={loading}
            redeeming={redeeming}
            onRefresh={loadBondData}
            onReinvestBond={handleReinvestClick}
          />
        </Suspense>
      )}

      {activeTab === "notifications" && (
        <Suspense
          fallback={<LoadingState message="Loading notifications..." />}
        >
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
