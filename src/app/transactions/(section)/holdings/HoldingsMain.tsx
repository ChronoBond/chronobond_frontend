"use client";

import { Suspense, lazy } from "react";
import { useFlowCurrentUser } from "@onflow/kit";
import { useHoldings } from "./useHoldings";
import { LoadingState } from "@/components/ui/loading-state";

// Lazy load components for better performance
const HoldingsPortfolioSummary = lazy(() => import("./HoldingsPortfolioSummary").then(module => ({ default: module.HoldingsPortfolioSummary })));
const HoldingsBondCard = lazy(() => import("./HoldingsBondCard").then(module => ({ default: module.HoldingsBondCard })));
const HoldingsListingModal = lazy(() => import("./HoldingsListingModal").then(module => ({ default: module.HoldingsListingModal })));
const HoldingsEmptyState = lazy(() => import("./HoldingsEmptyState").then(module => ({ default: module.HoldingsEmptyState })));
const HoldingsWalletPrompt = lazy(() => import("./HoldingsWalletPrompt").then(module => ({ default: module.HoldingsWalletPrompt })));
const HoldingsPortfolioHeader = lazy(() => import("./HoldingsPortfolioHeader").then(module => ({ default: module.HoldingsPortfolioHeader })));

const HoldingsMain = () => {
  const { user } = useFlowCurrentUser();
  const {
    bonds,
    isLoading,
    selectedBond,
    selectedBondDetails,
    listingPrice,
    showListingForm,
    listingState,
    loadUserBonds,
    handleListBond,
    handleRedeemBond,
    handleConfirmListing,
    setShowListingForm,
    setSelectedBond,
    setSelectedBondDetails,
    setListingPrice,
    setListingState,
    formatFlow,
    formatDate,
    isMatured,
    calculateCurrentYield
  } = useHoldings();

  if (!user?.loggedIn) {
    return (
      <Suspense fallback={<LoadingState message="Loading wallet prompt..." />}>
        <HoldingsWalletPrompt />
      </Suspense>
    );
  }

  if (isLoading) {
    return <LoadingState message="Loading your bond portfolio..." />;
  }

  const handleCloseModal = () => {
    setShowListingForm(false);
    setSelectedBond(null);
    setSelectedBondDetails(null);
    setListingPrice("");
    setListingState({
      state: 'idle',
      statusString: '',
      txId: null
    });
  };

  return (
    <div className="app-container space-y-8">
      {/* Portfolio Summary */}
      <Suspense fallback={<LoadingState message="Loading portfolio summary..." />}>
        <HoldingsPortfolioSummary 
          bonds={bonds}
          formatFlow={formatFlow}
          calculateCurrentYield={calculateCurrentYield}
        />
      </Suspense>

      {/* Bonds Portfolio */}
      <div className="space-y-6">
        <Suspense fallback={<LoadingState message="Loading portfolio header..." />}>
          <HoldingsPortfolioHeader onRefresh={loadUserBonds} />
        </Suspense>
        
        {bonds.length === 0 ? (
          <Suspense fallback={<LoadingState message="Loading empty state..." />}>
            <HoldingsEmptyState />
          </Suspense>
        ) : (
          <div className="space-y-4">
            {bonds.map((bond) => (
              <Suspense key={bond.id} fallback={<LoadingState message="Loading bond card..." />}>
                <HoldingsBondCard
                  bond={bond}
                  onListBond={() => handleListBond(bond)}
                  onRedeemBond={() => handleRedeemBond(bond)}
                  isMatured={isMatured(bond.maturityDate)}
                  formatFlow={formatFlow}
                  formatDate={formatDate}
                  calculateCurrentYield={calculateCurrentYield}
                />
              </Suspense>
            ))}
          </div>
        )}
      </div>

      {/* Listing Modal */}
      <Suspense fallback={<LoadingState message="Loading listing modal..." />}>
        <HoldingsListingModal
          isOpen={showListingForm}
          selectedBond={selectedBond}
          selectedBondDetails={selectedBondDetails}
          listingPrice={listingPrice}
          listingState={listingState}
          onClose={handleCloseModal}
          onPriceChange={setListingPrice}
          onConfirmListing={handleConfirmListing}
          formatFlow={formatFlow}
        />
      </Suspense>
    </div>
  );
};

export default HoldingsMain;
