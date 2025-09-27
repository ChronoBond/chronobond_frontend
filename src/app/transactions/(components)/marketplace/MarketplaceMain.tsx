"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
      </motion.div>
    );
  }

  return (
    <div className="app-container space-y-8">
      {/* Marketplace Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="card-professional">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text">
                  Bond Marketplace
                </CardTitle>
                <CardDescription>
                  List your bonds for sale or purchase bonds from other users
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Connected:{" "}
                <span className="font-mono">
                  {formatAddress(user.addr || "")}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
          {[
            {
              key: "buy",
              label: "🛒 Buy Bonds",
              desc: "Browse available bonds",
            },
            {
              key: "sell",
              label: "💰 Sell Bonds",
              desc: "List your bonds for sale",
            },
            {
              key: "manage",
              label: "📊 Manage Listings",
              desc: "Manage your active listings",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "buy" | "sell" | "manage")}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-card text-primary shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="font-semibold">{tab.label}</div>
              <div className="text-xs opacity-80">{tab.desc}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Transaction Status */}
      {txStatus.statusString && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
        </motion.div>
      )}

      {/* Buy Tab - Real Marketplace Listings */}
      {activeTab === "buy" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">
                    🛒 Available Bonds
                  </CardTitle>
                  <CardDescription>
                    Browse and purchase bonds listed by other users
                  </CardDescription>
                </div>
                <Button
                  onClick={loadData}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={loading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
                  <span>🔍 Querying blockchain for listings...</span>
                </div>
              ) : marketplaceListings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No bonds available
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to list a bond for sale in the Sell tab!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketplaceListings.map((listing) => (
                    <motion.div
                      key={`${listing.seller}-${listing.bondID}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border border-border rounded-lg p-4"
                    >
                      <h3 className="font-semibold text-lg mb-2">
                        🔗 Bond #{listing.bondID}
                      </h3>
                      <div className="space-y-1 text-sm text-muted-foreground mb-3">
                        <p>
                          <span className="font-medium">💰 Price:</span>{" "}
                          {listing.price} FLOW
                        </p>
                        <p>
                          <span className="font-medium">👤 Seller:</span>
                          <span className="font-mono text-xs ml-1">
                            {formatAddress(listing.seller)}
                          </span>
                        </p>
                        <p
                          className={`font-medium ${
                            listing.isAvailable ? "text-success" : "text-error"
                          }`}
                        >
                          {listing.isAvailable ? "✅ Available" : "❌ Sold"}
                        </p>
                      </div>
                      <Button
                        onClick={() => handlePurchaseBond(listing)}
                        disabled={
                          txStatus.state === "purchasing" ||
                          !listing.isAvailable
                        }
                        className="w-full btn-primary"
                        size="sm"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        {txStatus.state === "purchasing"
                          ? "Processing..."
                          : `Buy for ${listing.price} FLOW`}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Sell Tab - User's Bonds */}
      {activeTab === "sell" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">
                    💰 List Your Bonds for Sale
                  </CardTitle>
                  <CardDescription>
                    List your bonds for sale on the marketplace
                  </CardDescription>
                </div>
                <Button
                  onClick={loadData}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={loading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
                  <span>🔍 Loading your bonds...</span>
                </div>
              ) : userBonds.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                    <Tag className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No bonds to list
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Mint some bonds first to list them for sale!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBonds.map((bond, index) => (
                    <motion.div
                      key={bond.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">
                            🔗 Bond #{bond.id}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">💰 Principal:</span>{" "}
                              {bond.principal} FLOW
                            </p>
                            <p>
                              <span className="font-medium">📈 Yield:</span>{" "}
                              {(bond.yieldRate * 100).toFixed(1)}%
                            </p>
                            <p>
                              <span className="font-medium">⚡ Strategy:</span>{" "}
                              {bond.strategyID}
                            </p>
                            <p>
                              <span className="font-medium">📅 Status:</span>
                              <Badge
                                variant={
                                  isMatured(bond.maturityDate)
                                    ? "success"
                                    : "warning"
                                }
                                className="ml-1 text-xs"
                              >
                                {isMatured(bond.maturityDate)
                                  ? "Matured"
                                  : "Active"}
                              </Badge>
                            </p>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Price"
                              value={listingPrices[bond.id] || ""}
                              onChange={(e) =>
                                setListingPrices((prev) => ({
                                  ...prev,
                                  [bond.id]: e.target.value,
                                }))
                              }
                              className="w-24 h-8 text-sm"
                            />
                            <span className="text-sm text-muted-foreground">
                              FLOW
                            </span>
                          </div>
                          <Button
                            onClick={() =>
                              handleListBond(bond.id, listingPrices[bond.id])
                            }
                            disabled={
                              txStatus.state === "listing" ||
                              !listingPrices[bond.id] ||
                              isMatured(bond.maturityDate)
                            }
                            variant="default"
                            size="sm"
                            className="h-8 btn-primary"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {isMatured(bond.maturityDate)
                              ? "Matured"
                              : "List for Sale"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Manage Tab - User's Listings */}
      {activeTab === "manage" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="card-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">
                    📊 Your Active Listings
                  </CardTitle>
                  <CardDescription>
                    Manage your bonds listed for sale
                  </CardDescription>
                </div>
                <Button
                  onClick={loadData}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={loading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
                  <span>🔍 Loading your listings...</span>
                </div>
              ) : userListings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No active listings
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    List some bonds for sale to see them here!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userListings.map((listing, index) => (
                    <motion.div
                      key={listing.bondID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">
                            🔗 Bond #{listing.bondID}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">
                                💰 Listed Price:
                              </span>
                              <span className="text-primary font-bold ml-1">
                                {listing.price} FLOW
                              </span>
                            </p>
                            <p>
                              <span className="font-medium">📈 Status:</span>
                              <span
                                className={
                                  listing.isAvailable
                                    ? "text-success"
                                    : "text-error"
                                }
                              >
                                {listing.isAvailable
                                  ? " ✅ Available"
                                  : " ❌ Sold"}
                              </span>
                            </p>
                          </div>
                        </div>
                        {listing.isAvailable && (
                          <Button
                            onClick={() => handleWithdrawBond(listing.bondID)}
                            disabled={txStatus.state === "withdrawing"}
                            variant="outline"
                            size="sm"
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove from Sale
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default MarketplaceMain;
