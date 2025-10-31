"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { useFlowCurrentUser } from "@onflow/kit";
import { useToast } from "@/hooks/use-toast";
import {
  marketplaceService,
  type MarketplaceListing,
} from "@/lib/marketplace-service";
import { swapService } from "@/lib/swap-service";
import { chronoBondService, type BondData } from "@/lib/chronobond-service";
import {
  type MarketplaceHooksReturn,
  type ActiveTab,
  type TransactionStatus,
} from "@/types/marketplace.types";

export const useMarketplace = (): MarketplaceHooksReturn => {
  const { user } = useFlowCurrentUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTab>("buy");

  // Real blockchain data states
  const [marketplaceListings, setMarketplaceListings] = useState<
    MarketplaceListing[]
  >([]);
  const [userBonds, setUserBonds] = useState<BondData[]>([]);
  const [userListings, setUserListings] = useState<MarketplaceListing[]>([]);
  const [listingPrices, setListingPrices] = useState<{ [key: number]: string }>(
    {}
  );

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

  // Buy modal state
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] =
    useState<MarketplaceListing | null>(null);
  const [payToken, setPayToken] = useState<"FLOW" | "USDC">("FLOW");
  const [payQuote, setPayQuote] = useState<string | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [flowBalance, setFlowBalance] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab, user?.loggedIn]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.addr) {
        setFlowBalance(null);
        return;
      }
      try {
        const script = `
          import FungibleToken from 0xFungibleToken
          import FlowToken from 0xFlowToken

          access(all) fun main(address: Address): UFix64 {
            let account = getAccount(address)
            let cap = account.capabilities.get<&FlowToken.Vault{FungibleToken.Balance}>(/public/flowTokenBalance)
            if cap.check() { if let ref = cap.borrow() { return ref.balance } }
            return 0.0
          }
        `;
        const bal = await fcl.query({
          cadence: script,
          args: (arg: any, t: any) => [arg(user.addr, t.Address)],
        });
        setFlowBalance(parseFloat(bal?.toString?.() || "0"));
      } catch {
        setFlowBalance(null);
      }
    };
    fetchBalance();
  }, [user?.addr, buyModalOpen]);

  // Auto-switch to USDC after balance is fetched if FLOW is insufficient
  useEffect(() => {
    if (!buyModalOpen || !selectedListing) return;
    if (
      typeof flowBalance === "number" &&
      flowBalance < selectedListing.price &&
      payToken === "FLOW"
    ) {
      setPayToken("USDC");
    }
  }, [flowBalance, buyModalOpen, selectedListing, payToken]);

  // Load data from chain
  const loadData = async () => {
    if (!user?.loggedIn) {
      return;
    }

    try {
      setLoading(true);

      if (activeTab === "buy") {
        // Load all marketplace listings from known sellers
        const listings = await marketplaceService.getMarketplaceListings(
          knownSellers
        );
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
        const userOwnedListings =
          await marketplaceService.getUserMarketplaceListings(user.addr || "");
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

  // List a bond for sale
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
      const result = await marketplaceService.listBondForSale(
        bondId.toString(),
        price
      );

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
        statusString:
          error instanceof Error
            ? `❌ Failed to list bond: ${error.message}`
            : "❌ Failed to list bond",
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

  // Purchase a bond
  const handlePurchaseBond = async (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    // Auto-select USDC if FLOW balance is insufficient
    const shouldUseUsdc =
      typeof flowBalance === "number" && flowBalance < listing.price;
    setPayToken(shouldUseUsdc ? "USDC" : "FLOW");
    setPayQuote(null);
    setBuyModalOpen(true);
  };

  // Quote for USDC payment
  useEffect(() => {
    const fetchQuote = async () => {
      if (!selectedListing || payToken !== "USDC") {
        setPayQuote(null);
        return;
      }
      setQuoteLoading(true);
      const quote = await swapService.quoteIn({
        fromToken: "USDC",
        toToken: "FLOW",
        toTokenAmount: selectedListing.price.toString(),
      });
      setQuoteLoading(false);
      if (quote?.inputAmount) {
        setPayQuote(`~${parseFloat(quote.inputAmount).toFixed(2)} USDC`);
      } else {
        setPayQuote(null);
      }
    };
    fetchQuote();
  }, [selectedListing, payToken]);

  const confirmPurchase = async () => {
    if (!selectedListing) return;
    const listing = selectedListing;
    // Guard insufficient FLOW when paying with FLOW
    if (
      payToken === "FLOW" &&
      typeof flowBalance === "number" &&
      flowBalance < listing.price
    ) {
      setTxStatus({
        state: "error",
        statusString: "Insufficient FLOW balance",
        txId: null,
      });
      return;
    }
    setTxStatus({
      state: "purchasing",
      statusString:
        payToken === "USDC"
          ? `Purchasing with USDC...`
          : `Purchasing bond #${listing.bondID} for ${listing.price} FLOW...`,
      txId: null,
    });

    try {
      // Ensure buyer account is set up with ChronoBond collection
      if (user?.loggedIn) {
        const isSetup = await chronoBondService.checkAccountSetup(
          user.addr || ""
        );
        if (!isSetup) {
          setTxStatus({
            state: "purchasing",
            statusString: "Setting up account...",
            txId: null,
          });
          const setup = await chronoBondService.setupAccount();
          if (!setup.success)
            throw new Error(setup.error || "Failed to setup account");
        }
      }

      const result =
        payToken === "USDC"
          ? await marketplaceService.buyWithSwap(
              listing.seller,
              listing.bondID.toString(),
              listing.price.toString(),
              "USDC"
            )
          : await marketplaceService.purchaseBond(
              listing.seller,
              listing.bondID.toString(),
              listing.price.toString()
            );

      if (result.status === 4) {
        setTxStatus({
          state: "success",
          statusString: `✅ Successfully purchased bond #${listing.bondID}!`,
          txId: result.transactionId || null,
        });

        // Show success toast
        toast({
          title: "✅ Bond Purchased",
          description: `Successfully purchased bond #${listing.bondID} for ${listing.price} FLOW`,
        });

        setBuyModalOpen(false);
        setSelectedListing(null);
        await Promise.all([
          loadData(),
          (async () => {
            // refresh balance after purchase
            try {
              const script = `
              import FungibleToken from 0xFungibleToken
              import FlowToken from 0xFlowToken
              access(all) fun main(address: Address): UFix64 {
                let account = getAccount(address)
                let cap = account.capabilities.get<&FlowToken.Vault{FungibleToken.Balance}>(/public/flowTokenBalance)
                if cap.check() { if let ref = cap.borrow() { return ref.balance } }
                return 0.0
              }
            `;
              const bal = await fcl.query({
                cadence: script,
                args: (arg: any, t: any) => [arg(user?.addr, t.Address)],
              });
              setFlowBalance(parseFloat(bal?.toString?.() || "0"));
            } catch {}
          })(),
        ]);
        setTimeout(() => {
          setTxStatus({ state: "idle", statusString: "", txId: null });
        }, 3000);
      } else {
        throw new Error(result.errorMessage || "Purchase failed");
      }
    } catch (error: unknown) {
      setTxStatus({
        state: "error",
        statusString:
          error instanceof Error
            ? `❌ Purchase failed: ${error.message}`
            : "❌ Purchase failed",
        txId: null,
      });
      setTimeout(() => {
        setTxStatus({ state: "idle", statusString: "", txId: null });
      }, 5000);
    }
  };

  // Withdraw a listing
  const handleWithdrawListing = async (listing: MarketplaceListing) => {
    setTxStatus({
      state: "withdrawing",
      statusString: `Withdrawing bond #${listing.bondID} from sale...`,
      txId: null,
    });

    try {
      const result = await marketplaceService.withdrawBondFromSale(
        listing.bondID.toString()
      );

      if (result.status === 4) {
        setTxStatus({
          state: "success",
          statusString: `✅ Bond #${listing.bondID} withdrawn from sale!`,
          txId: result.transactionId || null,
        });

        // Show success toast
        toast({
          title: "📋 Listing Withdrawn",
          description: `Bond #${listing.bondID} withdrawn from sale successfully`,
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
        statusString:
          error instanceof Error
            ? `❌ Withdrawal failed: ${error.message}`
            : "❌ Withdrawal failed",
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
    setListingPrices((prev) => ({
      ...prev,
      [bondId]: price,
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
    return chronoBondService.calculateExpectedYield(
      bond.principal,
      bond.yieldRate
    );
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
    buyModalOpen,
    selectedListing,
    payToken,
    payQuote,
    quoteLoading,
    flowBalance: flowBalance ?? undefined,

    // Actions
    setActiveTab,
    loadData,
    handleListBond,
    handlePurchaseBond,
    handleWithdrawListing,
    handlePriceChange,
    setBuyModalOpen,
    setPayToken,
    confirmPurchase,

    // Utilities
    formatFlow,
    formatDate,
    isMatured,
    calculateCurrentYield,
  };
};
