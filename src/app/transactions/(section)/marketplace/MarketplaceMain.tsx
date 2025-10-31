"use client";

import { Suspense, lazy } from "react";
import { useFlowCurrentUser } from "@onflow/kit";
import { useMarketplace } from "./useMarketplace";
import { LoadingState } from "@/components/ui/loading-state";
import { Store } from "lucide-react";

// Lazy load heavy sections
const MarketplaceTabNavigation = lazy(() =>
  import("./MarketplaceTabNavigation").then((module) => ({
    default: module.MarketplaceTabNavigation,
  }))
);
const MarketplaceTransactionStatus = lazy(() =>
  import("./MarketplaceTransactionStatus").then((module) => ({
    default: module.MarketplaceTransactionStatus,
  }))
);
const MarketplaceHeader = lazy(() =>
  import("./MarketplaceHeader").then((module) => ({
    default: module.MarketplaceHeader,
  }))
);
const MarketplaceEmptyState = lazy(() =>
  import("./MarketplaceEmptyState").then((module) => ({
    default: module.MarketplaceEmptyState,
  }))
);
const MarketplaceListingCard = lazy(() =>
  import("./MarketplaceListingCard").then((module) => ({
    default: module.MarketplaceListingCard,
  }))
);
const MarketplaceBondCard = lazy(() =>
  import("./MarketplaceBondCard").then((module) => ({
    default: module.MarketplaceBondCard,
  }))
);
const MarketplaceManageCard = lazy(() =>
  import("./MarketplaceManageCard").then((module) => ({
    default: module.MarketplaceManageCard,
  }))
);
const MarketplaceWalletPrompt = lazy(() =>
  import("./MarketplaceWalletPrompt").then((module) => ({
    default: module.MarketplaceWalletPrompt,
  }))
);
const BuyModal = lazy(() =>
  import("./BuyModal").then((module) => ({ default: module.BuyModal }))
);

const MarketplaceMain = () => {
  const { user } = useFlowCurrentUser();
  const {
    activeTab,
    marketplaceListings,
    userBonds,
    userListings,
    listingPrices,
    loading,
    txStatus,
    buyModalOpen,
    selectedListing,
    payToken,
    payQuote,
    quoteLoading,
    flowBalance,
    setActiveTab,
    loadData,
    handleListBond,
    handlePurchaseBond,
    handleWithdrawListing,
    handlePriceChange,
    setBuyModalOpen,
    setPayToken,
    confirmPurchase,
    formatFlow,
    formatDate,
    isMatured,
    calculateCurrentYield,
  } = useMarketplace();

  if (!user?.loggedIn) {
    return (
      <Suspense fallback={<LoadingState message="Loading wallet prompt..." />}>
        <MarketplaceWalletPrompt />
      </Suspense>
    );
  }

  if (loading) {
    return <LoadingState message="Loading marketplace data..." />;
  }

  return (
    <div className="app-container space-y-8">
      {/* Modern Tab Navigation */}
      <div className="relative overflow-hidden rounded-2xl bg-semantic-surface backdrop-blur-xl border border-semantic-border p-6">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-900 flex items-center justify-center shadow-md">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-semantic-text">
                ChronoBond Marketplace
              </h1>
              <p className="text-brand-neutral text-lg">
                Buy, sell, and manage your time-locked bonds
              </p>
            </div>
          </div>

          <Suspense fallback={<LoadingState message="Loading navigation..." />}>
            <MarketplaceTabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </Suspense>
        </div>
      </div>

      {/* Transaction Status */}
      <Suspense
        fallback={<LoadingState message="Loading transaction status..." />}
      >
        <MarketplaceTransactionStatus txStatus={txStatus} />
      </Suspense>

      {/* Buy Tab - Real Marketplace Listings */}
      {activeTab === "buy" && (
        <div className="space-y-6">
          <Suspense fallback={<LoadingState message="Loading header..." />}>
            <MarketplaceHeader
              activeTab={activeTab}
              onRefresh={loadData}
              loading={loading}
            />
          </Suspense>

          {marketplaceListings.length === 0 ? (
            <Suspense
              fallback={<LoadingState message="Loading empty state..." />}
            >
              <MarketplaceEmptyState
                activeTab={activeTab}
                onRefresh={loadData}
              />
            </Suspense>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaceListings.map((listing) => (
                <Suspense
                  key={`${listing.seller}-${listing.bondID}`}
                  fallback={<LoadingState message="Loading listing card..." />}
                >
                  <MarketplaceListingCard
                    listing={listing}
                    onPurchase={handlePurchaseBond}
                    isPurchasing={txStatus.state === "purchasing"}
                    formatFlow={formatFlow}
                  />
                </Suspense>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sell Tab - User's Bonds */}
      {activeTab === "sell" && (
        <div className="space-y-6">
          <Suspense fallback={<LoadingState message="Loading header..." />}>
            <MarketplaceHeader
              activeTab={activeTab}
              onRefresh={loadData}
              loading={loading}
            />
          </Suspense>

          {userBonds.length === 0 ? (
            <Suspense
              fallback={<LoadingState message="Loading empty state..." />}
            >
              <MarketplaceEmptyState
                activeTab={activeTab}
                onRefresh={loadData}
              />
            </Suspense>
          ) : (
            <div className="space-y-4">
              {userBonds.map((bond) => (
                <Suspense
                  key={bond.id}
                  fallback={<LoadingState message="Loading bond card..." />}
                >
                  <MarketplaceBondCard
                    bond={bond}
                    listingPrice={listingPrices[bond.id] || ""}
                    onPriceChange={handlePriceChange}
                    onListBond={handleListBond}
                    isListing={txStatus.state === "listing"}
                    formatFlow={formatFlow}
                    formatDate={formatDate}
                    calculateCurrentYield={calculateCurrentYield}
                  />
                </Suspense>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manage Tab - User's Listings */}
      {activeTab === "manage" && (
        <div className="space-y-6">
          <Suspense fallback={<LoadingState message="Loading header..." />}>
            <MarketplaceHeader
              activeTab={activeTab}
              onRefresh={loadData}
              loading={loading}
            />
          </Suspense>

          {userListings.length === 0 ? (
            <Suspense
              fallback={<LoadingState message="Loading empty state..." />}
            >
              <MarketplaceEmptyState
                activeTab={activeTab}
                onRefresh={loadData}
              />
            </Suspense>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userListings.map((listing) => (
                <Suspense
                  key={`${listing.seller}-${listing.bondID}`}
                  fallback={<LoadingState message="Loading manage card..." />}
                >
                  <MarketplaceManageCard
                    listing={listing}
                    onWithdraw={handleWithdrawListing}
                    isWithdrawing={txStatus.state === "withdrawing"}
                    formatFlow={formatFlow}
                  />
                </Suspense>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Buy Modal */}
      <Suspense fallback={null}>
        <BuyModal
          open={Boolean(buyModalOpen)}
          onClose={() => (setBuyModalOpen ? setBuyModalOpen(false) : undefined)}
          listing={selectedListing ?? null}
          payToken={(payToken ?? "FLOW") as "FLOW" | "USDC"}
          onPayTokenChange={setPayToken || (() => {})}
          payQuote={payQuote ?? null}
          quoteLoading={Boolean(quoteLoading)}
          onConfirm={confirmPurchase || (() => {})}
          isPurchasing={txStatus.state === "purchasing"}
          flowBalance={flowBalance}
        />
      </Suspense>
    </div>
  );
};

export default MarketplaceMain;
