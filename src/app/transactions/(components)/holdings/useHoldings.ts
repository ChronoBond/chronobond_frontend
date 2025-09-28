"use client";

import { useState, useEffect } from "react";
import { useFlowCurrentUser } from "@onflow/kit";
import { chronoBondService, type BondData, type BondDetails } from "@/lib/chronobond-service";
import { bondRedemptionService } from "@/lib/bond-redemption-service";
import { marketplaceService } from "@/lib/marketplace-service";
import { type HoldingsHooksReturn, type ListingStatus } from "@/types/holding.types";

export const useHoldings = (): HoldingsHooksReturn => {
  const { user } = useFlowCurrentUser();
  const [selectedBond, setSelectedBond] = useState<BondData | null>(null);
  const [selectedBondDetails, setSelectedBondDetails] = useState<BondDetails | null>(null);
  const [listingPrice, setListingPrice] = useState("");
  const [showListingForm, setShowListingForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bonds, setBonds] = useState<BondData[]>([]);

  // Real listing state
  const [listingState, setListingState] = useState<ListingStatus>({
    state: 'idle',
    statusString: '',
    txId: null
  });

  // Load real bonds from blockchain
  useEffect(() => {
    if (user?.loggedIn) {
      loadUserBonds();
    } else {
      setBonds([]);
      setIsLoading(false);
    }
  }, [user?.loggedIn]);

  const loadUserBonds = async () => {
    if (!user?.addr) return;
    
    setIsLoading(true);
    try {
      const userBonds = await chronoBondService.getUserBonds(user.addr);
      setBonds(userBonds);
    } catch (error) {
      /* console.error("Error loading bonds:", error); */
      setBonds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListBond = async (bond: BondData) => {
    setSelectedBond(bond);
    
    // Get detailed bond information
    if (user?.addr) {
      try {
        const details = await chronoBondService.getBondDetails(user.addr, bond.id.toString());
        setSelectedBondDetails(details);
      } catch (error) {
        /* console.error("Error getting bond details:", error); */
      }
    }
    
    setShowListingForm(true);
  };

  const handleConfirmListing = async () => {
    if (!selectedBond || !listingPrice || parseFloat(listingPrice) <= 0 || isNaN(parseFloat(listingPrice))) {
      return;
    }

    if (!user?.loggedIn) {
      alert("Please connect your wallet first");
      return;
    }

    setListingState({
      state: 'pending',
      statusString: 'Submitting transaction...',
      txId: null
    });

    try {
      const result = await marketplaceService.listBondForSale(selectedBond.id.toString(), listingPrice);
      
      if (result.status === 4) {
        setListingState({
          state: 'success',
          statusString: 'Bond listed successfully!',
          txId: result.transactionId || null
        });

        // Remove bond from holdings (it's now listed for sale)
        setBonds(prev => prev.filter(b => b.id !== selectedBond.id));

        // Auto-close after success
        setTimeout(() => {
          setShowListingForm(false);
          setSelectedBond(null);
          setSelectedBondDetails(null);
          setListingPrice("");
          setListingState({
            state: 'idle',
            statusString: '',
            txId: null
          });
        }, 3000);
      } else {
        throw new Error(result.errorMessage || "Failed to list bond");
      }

    } catch (error: unknown) {
      /* console.error("Listing failed:", error); */
      
      setListingState({
        state: 'error',
        statusString: error instanceof Error ? error.message : 'Transaction failed',
        txId: null
      });

      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setListingState({
          state: 'idle',
          statusString: '',
          txId: null
        });
      }, 5000);
    }
  };

  const handleRedeemBond = async (bond: BondData) => {
    const confirmMessage = `Redeem Bond #${bond.id}?\n\n` +
      `Principal: ${formatFlow(bond.principal)}\n` +
      `Expected Yield: ${formatFlow(calculateCurrentYield(bond))}\n` +
      `Total: ${formatFlow(bond.principal + calculateCurrentYield(bond))}`;

    if (!confirm(confirmMessage)) return;

    try {
      /* console.log(`💰 Redeeming bond ${bond.id}...`); */
      
      const result = await bondRedemptionService.redeemBond(bond.id.toString());

      if (result.success) {
        alert(`✅ Successfully redeemed Bond #${bond.id}!`);
        /* console.log("✅ Bond redeemed successfully"); */
        await loadUserBonds(); // Refresh the holdings
      } else {
        throw new Error(result.error || "Redemption failed");
      }
    } catch (error: unknown) {
      /* console.error("❌ Error redeeming bond:", error); */
      alert(error instanceof Error ? `❌ Failed to redeem bond: ${error.message}` : '❌ Failed to redeem bond');
    }
  };

  const formatFlow = (amount: number) => {
    return chronoBondService.formatFlowAmount(amount);
  };

  const formatDate = (timestamp: number) => {
    return chronoBondService.formatTimestamp(timestamp);
  };

  const isMatured = (maturityDate: number) => {
    return Date.now() / 1000 >= maturityDate;
  };

  const calculateCurrentYield = (bond: BondData) => {
    return chronoBondService.calculateExpectedYield(bond.principal, bond.yieldRate);
  };

  return {
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
  };
};
