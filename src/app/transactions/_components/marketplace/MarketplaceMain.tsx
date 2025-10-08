"use client";

import { Suspense, lazy } from "react";
import { useFlowCurrentUser } from "@onflow/kit";
import { useMarketplace } from "./useMarketplace";
import { LoadingState } from "@/components/ui/loading-state";

// Lazy load components for better performance
const MarketplaceTabNavigation = lazy(() => import("./MarketplaceTabNavigation").then(module => ({ default: module.MarketplaceTabNavigation })));
const MarketplaceTransactionStatus = lazy(() => import("./MarketplaceTransactionStatus").then(module => ({ default: module.MarketplaceTransactionStatus })));
const MarketplaceHeader = lazy(() => import("./MarketplaceHeader").then(module => ({ default: module.MarketplaceHeader })));
const MarketplaceEmptyState = lazy(() => import("./MarketplaceEmptyState").then(module => ({ default: module.MarketplaceEmptyState })));
const MarketplaceListingCard = lazy(() => import("./MarketplaceListingCard").then(module => ({ default: module.MarketplaceListingCard })));
const MarketplaceBondCard = lazy(() => import("./MarketplaceBondCard").then(module => ({ default: module.MarketplaceBondCard })));
const MarketplaceManageCard = lazy(() => import("./MarketplaceManageCard").then(module => ({ default: module.MarketplaceManageCard })));

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
    setActiveTab,
    loadData,
    handleListBond,
    handlePurchaseBond,
    handleWithdrawListing,
    handlePriceChange,
    formatFlow,
    formatDate,
    isMatured,
    calculateCurrentYield
  } = useMarketplace();

  if (!user?.loggedIn) {
    return (
      <div className="app-container">
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 text-muted-foreground">🔐</div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Connect Wallet to Access Marketplace
          </h3>
          <p className="text-brand-neutral mb-6">
            Please connect your Flow wallet to browse and trade bonds
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Loading marketplace data..." />;
  }

  return (
    <div className="app-container space-y-8">
      {/* Modern Tab Navigation */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-white/10 p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 text-white">🏪</div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-brand-primary/70 bg-clip-text text-transparent">
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
      <Suspense fallback={<LoadingState message="Loading transaction status..." />}>
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
            <Suspense fallback={<LoadingState message="Loading empty state..." />}>
              <MarketplaceEmptyState 
                activeTab={activeTab} 
                onRefresh={loadData} 
              />
            </Suspense>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaceListings.map((listing) => (
                <Suspense key={`${listing.seller}-${listing.bondID}`} fallback={<LoadingState message="Loading listing card..." />}>
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
            <Suspense fallback={<LoadingState message="Loading empty state..." />}>
              <MarketplaceEmptyState 
                activeTab={activeTab} 
                onRefresh={loadData} 
              />
            </Suspense>
          ) : (
            <div className="space-y-4">
              {userBonds.map((bond) => (
                <Suspense key={bond.id} fallback={<LoadingState message="Loading bond card..." />}>
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
            <Suspense fallback={<LoadingState message="Loading empty state..." />}>
              <MarketplaceEmptyState 
                activeTab={activeTab} 
                onRefresh={loadData} 
              />
            </Suspense>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userListings.map((listing) => (
                <Suspense key={`${listing.seller}-${listing.bondID}`} fallback={<LoadingState message="Loading manage card..." />}>
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
    </div>
  );
};

export default MarketplaceMain;