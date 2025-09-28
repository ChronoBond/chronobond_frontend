"use client";

import { useState, useEffect } from "react";
import { useFlowCurrentUser } from "@onflow/kit";
import { marketplaceService, type MarketplaceListing } from "@/lib/marketplace-service";
import { chronoBondService, type BondData } from "@/lib/chronobond-service";
import { type MarketplaceHooksReturn, type ActiveTab, type TransactionStatus } from "@/types/marketplace.types";

export const useMarketplace = (): MarketplaceHooksReturn => {
  const { user } = useFlowCurrentUser();
  const [activeTab, setActiveTab] = useState<ActiveTab>("buy");

  // Real blockchain data states
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>([]);
  const [userBonds, setUserBonds] = useState<BondData[]>([]);
  const [userListings, setUserListings] = useState<MarketplaceListing[]>([]);
  const [listingPrices, setListingPrices] = useState<{ [key: number]: string }>({});

  // Known sellers for browsing marketplace
  const [knownSellers] = useState([
    "0x45722594009505d7", // Testnet contract account
    // Add more seller addresses here as users list bonds
  ]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<TransactionStatus>({
    state: "idle",
    statusString: "",
    txId: null,
  });

  useEffect(() => {
    loadData();
  }, [activeTab, user?.loggedIn]);

  // 🔍 LOAD REAL BLOCKCHAIN DATA
  const loadData = async () => {
    if (!user?.loggedIn) {
      return;
    }

    try {
      setLoading(true);

      if (activeTab === "buy") {
        // Load all marketplace listings from known sellers
        const listings = await marketplaceService.getMarketplaceListings(knownSellers);
        // Filter out user's own listings from buy tab
        const availableListings = listings.filter(
          (listing) => listing.seller !== user.addr
        );
        setMarketplaceListings(availableListings);
      } else if (activeTab === "sell") {
        // Load user's bonds available for selling
        const bonds = await chronoBondService.getUserBonds(user.addr || "");
        setUserBonds(bonds);

        // Initialize listing prices with 20% markup
        const prices: { [key: number]: string } = {};
        bonds.forEach((bond) => {
          prices[bond.id] = (bond.principal * 1.2).toFixed(2);
        });
        setListingPrices(prices);
      } else if (activeTab === "manage") {
        // Load user's active listings
        const userOwnedListings = await marketplaceService.getUserMarketplaceListings(user.addr || "");
        setUserListings(userOwnedListings);
      }
    } catch (error) {
      setTxStatus({
        state: "error",
        statusString: "Failed to load marketplace data",
        txId: null,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ 1. LIST BOND FOR SALE (Real Transaction)
  const handleListBond = async (bondId: number, price: string) => {
    if (!price || parseFloat(price) <= 0) {
      setTxStatus({
        state: "error",
        statusString: "Please enter a valid price",
        txId: null,
      });
      return;
    }

    setTxStatus({
      state: "listing",
      statusString: `Listing bond ${bondId} for ${price} FLOW...`,
      txId: null,
    });

    try {
      const result = await marketplaceService.listBondForSale(bondId.toString(), price);

      if (result.status === 4) {
        setTxStatus({
          state: "success",
          statusString: `✅ Bond #${bondId} listed for sale at ${price} FLOW!`,
          txId: result.transactionId || null,
        });
        await loadData(); // Refresh real data

        // Auto-clear success after 3 seconds
        setTimeout(() => {
          setTxStatus({
            state: "idle",
            statusString: "",
            txId: null,
          });
        }, 3000);
      } else {
        throw new Error(result.errorMessage || "Transaction failed");
      }
    } catch (error: unknown) {
      setTxStatus({
        state: "error",
        statusString: error instanceof Error ? `❌ Failed to list bond: ${error.message}` : "❌ Failed to list bond",
        txId: null,
      });

      setTimeout(() => {
        setTxStatus({
          state: "idle",
          statusString: "",
          txId: null,
        });
      }, 5000);
    }
  };

  // ✅ 2. PURCHASE BOND (Real Transaction)
  const handlePurchaseBond = async (listing: MarketplaceListing) => {
    setTxStatus({
      state: "purchasing",
      statusString: `Purchasing bond #${listing.bondID} for ${listing.price} FLOW...`,
      txId: null,
    });

    try {
      const result = await marketplaceService.purchaseBond(listing.seller, listing.bondID.toString(), listing.price.toString());

      if (result.status === 4) {
        setTxStatus({
          state: "success",
          statusString: `✅ Successfully purchased bond #${listing.bondID}!`,
          txId: result.transactionId || null,
        });
        await loadData(); // Refresh real data

        // Auto-clear success after 3 seconds
        setTimeout(() => {
          setTxStatus({
            state: "idle",
            statusString: "",
            txId: null,
          });
        }, 3000);
      } else {
        throw new Error(result.errorMessage || "Purchase failed");
      }
    } catch (error: unknown) {
      setTxStatus({
        state: "error",
        statusString: error instanceof Error ? `❌ Purchase failed: ${error.message}` : "❌ Purchase failed",
        txId: null,
      });

      setTimeout(() => {
        setTxStatus({
          state: "idle",
          statusString: "",
          txId: null,
        });
      }, 5000);
    }
  };

  // ✅ 3. WITHDRAW LISTING (Real Transaction)
  const handleWithdrawListing = async (listing: MarketplaceListing) => {
    setTxStatus({
      state: "withdrawing",
      statusString: `Withdrawing bond #${listing.bondID} from sale...`,
      txId: null,
    });

    try {
      const result = await marketplaceService.withdrawBondFromSale(listing.bondID.toString());

      if (result.status === 4) {
        setTxStatus({
          state: "success",
          statusString: `✅ Bond #${listing.bondID} withdrawn from sale!`,
          txId: result.transactionId || null,
        });
        await loadData(); // Refresh real data

        // Auto-clear success after 3 seconds
        setTimeout(() => {
          setTxStatus({
            state: "idle",
            statusString: "",
            txId: null,
          });
        }, 3000);
      } else {
        throw new Error(result.errorMessage || "Withdrawal failed");
      }
    } catch (error: unknown) {
      setTxStatus({
        state: "error",
        statusString: error instanceof Error ? `❌ Withdrawal failed: ${error.message}` : "❌ Withdrawal failed",
        txId: null,
      });

      setTimeout(() => {
        setTxStatus({
          state: "idle",
          statusString: "",
          txId: null,
        });
      }, 5000);
    }
  };

  const handlePriceChange = (bondId: number, price: string) => {
    setListingPrices(prev => ({
      ...prev,
      [bondId]: price
    }));
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
    // State
    activeTab,
    marketplaceListings,
    userBonds,
    userListings,
    listingPrices,
    knownSellers,
    loading,
    txStatus,
    
    // Actions
    setActiveTab,
    loadData,
    handleListBond,
    handlePurchaseBond,
    handleWithdrawListing,
    handlePriceChange,
    
    // Utilities
    formatFlow,
    formatDate,
    isMatured,
    calculateCurrentYield
  };
};
