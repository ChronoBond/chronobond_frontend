"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useFlowCurrentUser } from "@onflow/kit";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Loader2,
  Users,
  DollarSign,
  Wallet,
  RefreshCw,
  Tag,
  Trash2,
  Link as LinkIcon,
  CheckCircle,
  Clock,
  AlertTriangle,
  Bell,
} from "lucide-react";
import {
  marketplaceService,
  type MarketplaceListing,
} from "@/lib/marketplace-service";
import { chronoBondService, type BondData } from "@/lib/chronobond-service";

// Real transaction state
type TransactionState =
  | "idle"
  | "listing"
  | "purchasing"
  | "withdrawing"
  | "success"
  | "error";

interface TransactionStatus {
  state: TransactionState;
  statusString: string;
  txId: string | null;
}

const MarketplaceMain = () => {
  const { user } = useFlowCurrentUser();
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | "manage">("buy");

  // Real blockchain data states
  const [marketplaceListings, setMarketplaceListings] = useState<
    MarketplaceListing[]
  >([]);
  const [userBonds, setUserBonds] = useState<BondData[]>([]);
  const [userListings, setUserListings] = useState<MarketplaceListing[]>([]);
  const [listingPrices, setListingPrices] = useState<{ [key: number]: string }>(
    {}
  );

  // Known sellers for browsing marketplace (add your own addresses here)
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
        /* console.log("🔍 Loading marketplace listings..."); */
        const listings = await marketplaceService.getMarketplaceListings(
          knownSellers
        );
        // Filter out user's own listings from buy tab
        const availableListings = listings.filter(
          (listing) => listing.seller !== user.addr
        );
        setMarketplaceListings(availableListings);
        /* console.log(
          `📊 Loaded ${availableListings.length} marketplace listings`
        ); */
      } else if (activeTab === "sell") {
        // Load user's bonds available for selling
        /* console.log("💰 Loading user bonds..."); */
        const bonds = await chronoBondService.getUserBonds(user.addr || "");
        setUserBonds(bonds);
        /* console.log(`🔗 Loaded ${bonds.length} user bonds`); */

        // Initialize listing prices with 20% markup
        const prices: { [key: number]: string } = {};
        bonds.forEach((bond) => {
          prices[bond.id] = (bond.principal * 1.2).toFixed(2);
        });
        setListingPrices(prices);
      } else if (activeTab === "manage") {
        // Load user's active listings
        /* console.log("📊 Loading user marketplace listings..."); */
        const userOwnedListings =
          await marketplaceService.getUserMarketplaceListings(user.addr || "");
        setUserListings(userOwnedListings);
        /* console.log(`📋 Loaded ${userOwnedListings.length} user listings`); */
      }
    } catch (error) {
      /* console.error("Error loading data:", error); */
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
      /* console.log(`💰 Listing bond ${bondId} for ${price} FLOW...`); */

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
        /* console.log("✅ Bond listed successfully on blockchain"); */
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
      /* console.error("❌ Error listing bond:", error); */
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

  // ✅ 2. PURCHASE BOND (Real Transaction)
  const handlePurchaseBond = async (listing: MarketplaceListing) => {
    if (
      !confirm(
        `Purchase Bond #${listing.bondID} for ${listing.price} FLOW from ${listing.seller}?`
      )
    ) {
      return;
    }

    setTxStatus({
      state: "purchasing",
      statusString: `Purchasing bond ${listing.bondID} for ${listing.price} FLOW...`,
      txId: null,
    });

    try {
      /* console.log(
        `🛒 Purchasing bond ${listing.bondID} for ${listing.price} FLOW...`
      ); */

      const result = await marketplaceService.purchaseBond(
        listing.seller,
        listing.bondID.toString(),
        listing.price.toString()
      );

      if (result.status === 4) {
        setTxStatus({
          state: "success",
          statusString: `✅ Successfully purchased Bond #${listing.bondID}!`,
          txId: result.transactionId || null,
        });
        /* console.log("✅ Bond purchased successfully on blockchain"); */
        await loadData(); // Refresh real data

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
      /* console.error("❌ Error purchasing bond:", error); */
      setTxStatus({
        state: "error",
        statusString:
          error instanceof Error
            ? `❌ Failed to purchase bond: ${error.message}`
            : "❌ Failed to purchase bond",
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

  // ✅ 3. WITHDRAW BOND FROM SALE (Real Transaction)
  const handleWithdrawBond = async (bondId: number) => {
    if (!confirm(`Remove Bond #${bondId} from sale?`)) {
      return;
    }

    setTxStatus({
      state: "withdrawing",
      statusString: `Withdrawing bond ${bondId} from sale...`,
      txId: null,
    });

    try {
      /* console.log(`📤 Withdrawing bond ${bondId} from sale...`); */

      const result = await marketplaceService.withdrawBondFromSale(
        bondId.toString()
      );

      if (result.status === 4) {
        setTxStatus({
          state: "success",
          statusString: `✅ Bond #${bondId} removed from sale!`,
          txId: result.transactionId || null,
        });
        /* console.log("✅ Bond withdrawn successfully from blockchain"); */
        await loadData(); // Refresh real data

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
      /* console.error("❌ Error withdrawing bond:", error); */
      setTxStatus({
        state: "error",
        statusString:
          error instanceof Error
            ? `❌ Failed to withdraw bond: ${error.message}`
            : "❌ Failed to withdraw bond",
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

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isMatured = (maturityDate: number) => {
    return Date.now() / 1000 >= maturityDate;
  };

  if (!user?.loggedIn) {
    return (
      <div
        className="app-container"
      >
        <Card className="card-professional mx-auto max-w-md">
          <CardContent className="p-12 text-center">
            <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              Connect Wallet to Access Marketplace
            </h3>
            <p className="text-muted-foreground mb-6">
              Please connect your Flow wallet to browse and trade bonds
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="app-container space-y-8">
      {/* Modern Marketplace Header */}
      <div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-white/10 p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-brand-primary/70 bg-clip-text text-transparent">
                  Bond Marketplace
                </h1>
                <p className="text-brand-neutral text-lg">
                  List your bonds for sale or purchase bonds from other users
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-brand-neutral">
                Connected:{" "}
                <span className="font-mono text-white">
                  {formatAddress(user.addr || "")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div>
        <div className="relative">
          {/* Desktop: Horizontal Pills */}
          <div className="hidden sm:flex items-center gap-2 p-2 bg-background/20 backdrop-blur-xl rounded-2xl border border-white/10">
            {[
              {
                key: "buy",
                label: "Buy Bonds",
                desc: "Browse available bonds",
                icon: <ShoppingCart className="w-4 h-4" />,
                color: "brand-primary"
              },
              {
                key: "sell",
                label: "Sell Bonds",
                desc: "List your bonds for sale",
                icon: <Tag className="w-4 h-4" />,
                color: "brand-accent"
              },
              {
                key: "manage",
                label: "Manage Listings",
                desc: "Manage your active listings",
                icon: <Users className="w-4 h-4" />,
                color: "brand-warning"
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "buy" | "sell" | "manage")}
                className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 text-white shadow-lg border border-brand-primary/30"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {activeTab === tab.key && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 animate-pulse" />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <div className="relative z-10 text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-80">{tab.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile: Scrollable Pills */}
          <div className="sm:hidden">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                {
                  key: "buy",
                  label: "Buy",
                  icon: <ShoppingCart className="w-4 h-4" />,
                  color: "brand-primary"
                },
                {
                  key: "sell",
                  label: "Sell",
                  icon: <Tag className="w-4 h-4" />,
                  color: "brand-accent"
                },
                {
                  key: "manage",
                  label: "Manage",
                  icon: <Users className="w-4 h-4" />,
                  color: "brand-warning"
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "buy" | "sell" | "manage")}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 text-white shadow-lg border border-brand-primary/30"
                      : "bg-background/20 text-white/70 hover:text-white hover:bg-white/5 border border-white/10"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      {txStatus.statusString && (
        <div
          className={`p-4 rounded-lg border ${
            txStatus.state === "success"
              ? "bg-success/10 text-success border-success/20"
              : txStatus.state === "error"
              ? "bg-error/10 text-error border-error/20"
              : "bg-primary/10 text-primary border-primary/20"
          }`}
        >
          <div className="flex items-center gap-3">
            {["listing", "purchasing", "withdrawing"].includes(
              txStatus.state
            ) && <Loader2 className="w-5 h-5 animate-spin" />}
            <div>
              <div className="font-semibold">{txStatus.statusString}</div>
              {txStatus.txId && (
                <div className="text-xs mt-1 opacity-70">
                  Transaction ID: {txStatus.txId}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Buy Tab - Real Marketplace Listings */}
      {activeTab === "buy" && (
        <div className="space-y-6">
          {/* Modern Buy Bonds Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                🛒 Available Bonds
              </h2>
              <p className="text-white/70">
                Browse and purchase bonds listed by other users
              </p>
            </div>
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="gap-2 bg-background/20 border-white/20 text-white hover:bg-white/10"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Modern Bond Listings */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-white/70">Querying blockchain for listings...</p>
              </div>
            </div>
          ) : marketplaceListings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No bonds available
              </h3>
              <p className="text-brand-neutral mb-6">
                Be the first to list a bond for sale in the Sell tab!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaceListings.map((listing) => (
                <ModernMarketplaceCard
                  key={`${listing.seller}-${listing.bondID}`}
                  listing={listing}
                  onPurchase={handlePurchaseBond}
                  isPurchasing={txStatus.state === "purchasing"}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sell Tab - User's Bonds */}
      {activeTab === "sell" && (
        <div className="space-y-6">
          {/* Modern Sell Bonds Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                💰 List Your Bonds for Sale
              </h2>
              <p className="text-white/70">
                List your bonds for sale on the marketplace
              </p>
            </div>
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="gap-2 bg-background/20 border-white/20 text-white hover:bg-white/10"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Modern User Bonds List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-white/70">Loading your bonds...</p>
              </div>
            </div>
          ) : userBonds.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
                <Tag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No bonds to list
              </h3>
              <p className="text-brand-neutral mb-6">
                Mint some bonds first to list them for sale!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userBonds.map((bond, index) => (
                <ModernSellBondCard
                  key={bond.id}
                  bond={bond}
                  listingPrice={listingPrices[bond.id] || ""}
                  onPriceChange={(price) =>
                    setListingPrices((prev) => ({
                      ...prev,
                      [bond.id]: price,
                    }))
                  }
                  onListBond={() =>
                    handleListBond(bond.id, listingPrices[bond.id])
                  }
                  isListing={txStatus.state === "listing"}
                  isMatured={isMatured(bond.maturityDate)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manage Tab - User's Listings */}
      {activeTab === "manage" && (
        <div className="space-y-6">
          {/* Modern Manage Listings Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                📊 Your Active Listings
              </h2>
              <p className="text-white/70">
                Manage your bonds listed for sale
              </p>
            </div>
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="gap-2 bg-background/20 border-white/20 text-white hover:bg-white/10"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Modern User Listings */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-white/70">Loading your listings...</p>
              </div>
            </div>
          ) : userListings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No active listings
              </h3>
              <p className="text-brand-neutral mb-6">
                List some bonds for sale to see them here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userListings.map((listing, index) => (
                <ModernManageListingCard
                  key={listing.bondID}
                  listing={listing}
                  onWithdraw={() => handleWithdrawBond(listing.bondID)}
                  isWithdrawing={txStatus.state === "withdrawing"}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplaceMain;

// Helper function for formatting addresses
const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Modern Marketplace Card Component
const ModernMarketplaceCard = ({ 
  listing, 
  onPurchase, 
  isPurchasing 
}: {
  listing: MarketplaceListing;
  onPurchase: (listing: MarketplaceListing) => void;
  isPurchasing: boolean;
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-brand-primary/40 hover:border-brand-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/10">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/10" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bond #{listing.bondID}</h3>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs px-2 py-1 ${
                listing.isAvailable 
                  ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/40' 
                  : 'bg-brand-error/20 text-brand-error border-brand-error/40'
              }`}>
                {listing.isAvailable ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Available
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Sold
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">💰 Price</div>
            <div className="text-lg font-bold text-brand-accent">{listing.price} FLOW</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">👤 Seller</div>
            <div className="text-sm font-mono text-white">{formatAddress(listing.seller)}</div>
          </div>
        </div>
        
        <Button
          onClick={() => onPurchase(listing)}
          disabled={isPurchasing || !listing.isAvailable}
          className="w-full bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          {isPurchasing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy for {listing.price} FLOW
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Modern Sell Bond Card Component
const ModernSellBondCard = ({
  bond,
  listingPrice,
  onPriceChange,
  onListBond,
  isListing,
  isMatured
}: {
  bond: BondData;
  listingPrice: string;
  onPriceChange: (price: string) => void;
  onListBond: () => void;
  isListing: boolean;
  isMatured: boolean;
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-brand-accent/40 hover:border-brand-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/10">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 via-transparent to-brand-primary/10" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center shadow-lg">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bond #{bond.id}</h3>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs px-2 py-1 ${
                isMatured 
                  ? 'bg-brand-warning/20 text-brand-warning border-brand-warning/40' 
                  : 'bg-brand-accent/20 text-brand-accent border-brand-accent/40'
              }`}>
                {isMatured ? (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Matured
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">💰 Principal</div>
            <div className="text-lg font-bold text-white">{bond.principal} FLOW</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">📈 Yield</div>
            <div className="text-lg font-bold text-brand-accent">{(bond.yieldRate * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">⚡ Strategy</div>
            <div className="text-sm font-medium text-white">{bond.strategyID}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">📅 Status</div>
            <div className="text-sm font-medium text-brand-warning">
              {isMatured ? "Matured" : "Active"}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <DollarSign className="w-4 h-4 text-white/70" />
            <Input
              type="number"
              step="0.1"
              placeholder="Price"
              value={listingPrice}
              onChange={(e) => onPriceChange(e.target.value)}
              className="flex-1 h-10 text-sm bg-white/5 border-white/20 text-white placeholder:text-white/50"
            />
            <span className="text-sm text-white/70">FLOW</span>
          </div>
          <Button
            onClick={onListBond}
            disabled={isListing || !listingPrice || isMatured}
            className="bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg w-full sm:w-auto"
            size="lg"
          >
            {isListing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Listing...
              </>
            ) : (
              <>
                <Tag className="w-4 h-4 mr-2" />
                {isMatured ? "Matured" : "List for Sale"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Modern Manage Listing Card Component
const ModernManageListingCard = ({
  listing,
  onWithdraw,
  isWithdrawing
}: {
  listing: MarketplaceListing;
  onWithdraw: () => void;
  isWithdrawing: boolean;
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-brand-warning/40 hover:border-brand-warning/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-warning/10">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-warning/10 via-transparent to-brand-primary/10" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-warning to-brand-primary flex items-center justify-center shadow-lg">
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bond #{listing.bondID}</h3>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs px-2 py-1 ${
                listing.isAvailable 
                  ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/40' 
                  : 'bg-brand-error/20 text-brand-error border-brand-error/40'
              }`}>
                {listing.isAvailable ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Available
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Sold
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">💰 Listed Price</div>
            <div className="text-lg font-bold text-brand-accent">{listing.price} FLOW</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">📈 Status</div>
            <div className={`text-sm font-medium ${
              listing.isAvailable ? 'text-brand-accent' : 'text-brand-error'
            }`}>
              {listing.isAvailable ? "✅ Available" : "❌ Sold"}
            </div>
          </div>
        </div>
        
        {listing.isAvailable && (
          <Button
            onClick={onWithdraw}
            disabled={isWithdrawing}
            className="w-full bg-brand-error text-white hover:bg-brand-error/90 shadow-lg"
            size="lg"
          >
            {isWithdrawing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Remove from Sale
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
