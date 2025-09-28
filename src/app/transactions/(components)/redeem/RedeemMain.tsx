"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import * as fcl from "@onflow/fcl";
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
import {
  Loader2,
  Clock,
  DollarSign,
  Bell,
  RefreshCw,
  Wallet,
  Link as LinkIcon,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  bondRedemptionService,
  type BondMaturityInfo,
} from "@/lib/bond-redemption-service";

const RedeemMain = () => {
  const { user } = useFlowCurrentUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<
    "redeemable" | "pending" | "notifications"
  >("redeemable");

  // Bond states
  const [redeemableBonds, setRedeemableBonds] = useState<BondMaturityInfo[]>(
    []
  );
  const [pendingBonds, setPendingBonds] = useState<BondMaturityInfo[]>([]);
  const [nearingMaturity, setNearingMaturity] = useState<BondMaturityInfo[]>(
    []
  );
  const [totalRedeemableValue, setTotalRedeemableValue] = useState<number>(0);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (user?.loggedIn) {
      loadBondData();
      // Set up auto-refresh every 30 seconds
      const interval = setInterval(loadBondData, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.loggedIn]);

  // 🔍 LOAD BOND DATA FROM BLOCKCHAIN
  const loadBondData = async () => {
    if (!user?.addr) return;

    try {
      setLoading(true);
      /* console.log("🔍 Loading bond redemption data..."); */

      // Load all bond data in parallel
      const [redeemable, pending, nearing, totalValue] = await Promise.all([
        bondRedemptionService.getRedeemableBonds(user.addr),
        getAllPendingBonds(),
        bondRedemptionService.getBondsNearingMaturity(user.addr, 24),
        bondRedemptionService.getTotalRedeemableValue(user.addr),
      ]);

      setRedeemableBonds(redeemable);
      setPendingBonds(pending);
      setNearingMaturity(nearing);
      setTotalRedeemableValue(totalValue);

      /* console.log(`📊 Loaded: ${redeemable.length} redeemable, ${pending.length} pending, ${nearing.length} nearing maturity`); */
    } catch (error) {
      /* console.error("Error loading bond data:", error); */
      setError("Failed to load bond data");
    } finally {
      setLoading(false);
    }
  };

  // Get all pending (non-matured) bonds
  const getAllPendingBonds = async (): Promise<BondMaturityInfo[]> => {
    try {
      const bondsScript = `
        import NonFungibleToken from 0xNonFungibleToken
        import ChronoBond from 0xChronoBond

        access(all) fun main(address: Address): [UInt64] {
          let account = getAccount(address)
          let collectionRef = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(ChronoBond.CollectionPublicPath).borrow()
          if collectionRef == nil { return [] }
          return collectionRef!.getIDs()
        }
      `;

      const bondIDs = await fcl.query({
        cadence: bondsScript,
        args: (arg: any, t: any) => [arg(user?.addr, t.Address)],
      });

      if (!bondIDs || bondIDs.length === 0) return [];

      const maturityPromises = bondIDs.map((bondID: number) =>
        bondRedemptionService.checkBondMaturity(
          user?.addr || "",
          bondID.toString()
        )
      );

      const maturityResults = await Promise.all(maturityPromises);

      return maturityResults.filter(
        (bond): bond is BondMaturityInfo => bond !== null && !bond.isMatured
      );
    } catch (error) {
      /* console.error("Error getting pending bonds:", error); */
      return [];
    }
  };

  // ✅ REDEEM BOND HANDLER
  const handleRedeemBond = async (bond: BondMaturityInfo) => {
    if (!bond.isMatured) {
      setError("Bond is not yet matured for redemption");
      return;
    }

    const confirmMessage =
      `Redeem Bond #${bond.bondID}?\n\n` +
      `Principal: ${bondRedemptionService.formatCurrency(bond.principal)}\n` +
      `Yield: ${bondRedemptionService.formatCurrency(bond.expectedYield)}\n` +
      `Total: ${bondRedemptionService.formatCurrency(bond.expectedTotal)}`;

    if (!confirm(confirmMessage)) return;

    setRedeeming((prev) => ({ ...prev, [bond.bondID]: true }));
    setError(null);

    try {
      /* console.log(`💰 Redeeming bond ${bond.bondID}...`); */

      const result = await bondRedemptionService.redeemBond(
        bond.bondID.toString()
      );

      if (result.success) {
        setSuccess(
          `✅ Successfully redeemed Bond #${
            bond.bondID
          } for ${bondRedemptionService.formatCurrency(bond.expectedTotal)}!`
        );
        /* console.log("✅ Bond redeemed successfully"); */
        await loadBondData(); // Refresh data

        // Auto-clear success after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        throw new Error(result.error || "Redemption failed");
      }
    } catch (error: unknown) {
      /* console.error("❌ Error redeeming bond:", error); */
      setError(
        error instanceof Error
          ? `❌ Failed to redeem bond: ${error.message}`
          : "❌ Failed to redeem bond"
      );
    } finally {
      setRedeeming((prev) => ({ ...prev, [bond.bondID]: false }));
    }
  };

  // ✅ REDEEM ALL BONDS HANDLER
  const handleRedeemAllBonds = async () => {
    if (redeemableBonds.length === 0) return;

    const confirmMessage =
      `Redeem all ${redeemableBonds.length} matured bonds?\n\n` +
      `Total value: ${bondRedemptionService.formatCurrency(
        totalRedeemableValue
      )}`;

    if (!confirm(confirmMessage)) return;

    setLoading(true);
    setError(null);

    try {
      /* console.log(`💰 Redeeming ${redeemableBonds.length} bonds...`); */

      const redemptionPromises = redeemableBonds.map((bond) =>
        bondRedemptionService.redeemBond(bond.bondID.toString())
      );

      const results = await Promise.all(redemptionPromises);
      const successful = results.filter((r) => r.success).length;
      const failed = results.length - successful;

      if (successful > 0) {
        setSuccess(
          `✅ Successfully redeemed ${successful} bonds for ${bondRedemptionService.formatCurrency(
            totalRedeemableValue
          )}!`
        );
      }

      if (failed > 0) {
        setError(`❌ Failed to redeem ${failed} bonds`);
      }

      await loadBondData(); // Refresh data
    } catch (error: unknown) {
      /* console.error("❌ Error redeeming bonds:", error); */
      setError(
        error instanceof Error
          ? `❌ Failed to redeem bonds: ${error.message}`
          : "❌ Failed to redeem bonds"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Reveal animation when component mounts
  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll(".reveal-item");
    if (elements && elements.length > 0) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // Tab switching animation
  useEffect(() => {
    const tabContent = containerRef.current?.querySelector(".tab-content");
    if (tabContent) {
      gsap.fromTo(
        tabContent,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [activeTab]);

  if (!user?.loggedIn) {
    return (
      <div className="app-container">
        <Card className="card-professional mx-auto max-w-md">
          <CardContent className="p-12 text-center">
            <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">
              Connect Wallet to Redeem Bonds
            </h3>
            <p className="text-muted-foreground mb-6">
              Please connect your Flow wallet to view and redeem your bonds
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="app-container space-y-6 pb-8">
      {/* Modern Bond Redemption Header */}
      <div className="reveal-item">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-white/10 p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-brand-primary/70 bg-clip-text text-transparent">
                  Bond Redemption Center
                </h1>
                <p className="text-brand-neutral text-lg">
                  Redeem your matured bonds and track upcoming maturities
                </p>
              </div>
            </div>

            {/* Compact Status Overview Bar */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/40">
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-brand-accent font-medium text-sm">
                  {redeemableBonds.length} Ready
                </span>
                <span className="text-brand-accent/80 text-sm">
                  {bondRedemptionService.formatCurrency(totalRedeemableValue)}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/40">
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="text-brand-primary font-medium text-sm">
                  {pendingBonds.length} Pending
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-warning/10 border border-brand-warning/40">
                <div className="w-2 h-2 rounded-full bg-brand-warning animate-pulse" />
                <span className="text-brand-warning font-medium text-sm">
                  {nearingMaturity.length} Nearing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-error/10 text-error border border-error/20 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearMessages}
              className="text-error hover:text-error/80"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-success/10 text-success border border-success/20 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button
              onClick={clearMessages}
              className="text-success hover:text-success/80"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Modern Tab Navigation */}
      <div className="reveal-item">
        <div className="relative">
          {/* Desktop: Horizontal Pills */}
          <div className="hidden sm:flex items-center gap-2 p-2 bg-background/20 backdrop-blur-xl rounded-2xl border border-white/10">
            {[
              {
                key: "redeemable",
                label: "Ready to Redeem",
                icon: "💰",
                count: redeemableBonds.length,
                badgeBg: "bg-brand-accent/20",
                badgeText: "text-brand-accent",
              },
              {
                key: "pending",
                label: "Pending Bonds",
                icon: "⏳",
                count: pendingBonds.length,
                badgeBg: "bg-brand-primary/20",
                badgeText: "text-brand-primary",
              },
              {
                key: "notifications",
                label: "Notifications",
                icon: "🔔",
                count: nearingMaturity.length,
                badgeBg: "bg-brand-warning/20",
                badgeText: "text-brand-warning",
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveTab(
                    tab.key as "redeemable" | "pending" | "notifications"
                  )
                }
                className={`relative flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 text-white shadow-lg border border-brand-primary/30"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {activeTab === tab.key && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 animate-pulse" />
                )}
                <span className="relative z-10 text-lg">
                  {tab.key === "redeemable" && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {tab.key === "pending" && <Clock className="w-4 h-4" />}
                  {tab.key === "notifications" && <Bell className="w-4 h-4" />}
                </span>
                <span className="relative z-10">{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`relative z-10 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      activeTab === tab.key
                        ? "bg-white text-brand-primary"
                        : `${tab.badgeBg} ${tab.badgeText}`
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile: Scrollable Pills */}
          <div className="sm:hidden">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                {
                  key: "redeemable",
                  label: "Ready",
                  icon: "💰",
                  count: redeemableBonds.length,
                  badgeBg: "bg-brand-accent/20",
                  badgeText: "text-brand-accent",
                },
                {
                  key: "pending",
                  label: "Pending",
                  icon: "⏳",
                  count: pendingBonds.length,
                  badgeBg: "bg-brand-primary/20",
                  badgeText: "text-brand-primary",
                },
                {
                  key: "notifications",
                  label: "Alerts",
                  icon: "🔔",
                  count: nearingMaturity.length,
                  badgeBg: "bg-brand-warning/20",
                  badgeText: "text-brand-warning",
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() =>
                    setActiveTab(
                      tab.key as "redeemable" | "pending" | "notifications"
                    )
                  }
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 text-white shadow-lg border border-brand-primary/30"
                      : "bg-background/20 text-white/70 hover:text-white hover:bg-white/5 border border-white/10"
                  }`}
                >
                  <span className="text-lg">
                    {tab.key === "redeemable" && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {tab.key === "pending" && <Clock className="w-4 h-4" />}
                    {tab.key === "notifications" && (
                      <Bell className="w-4 h-4" />
                    )}
                  </span>
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                        activeTab === tab.key
                          ? "bg-white text-brand-primary"
                          : `${tab.badgeBg} ${tab.badgeText}`
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Redeemable Bonds Tab */}
      {activeTab === "redeemable" && (
        <div className="tab-content space-y-6">
          {/* Modern Bond List Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                💰 Ready for Redemption
              </h2>
              <p className="text-white/70">
                Redeem your matured bonds to receive principal + yield
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-64">
              <Button
                onClick={loadBondData}
                disabled={loading}
                variant="outline"
                size="sm"
                className="gap-2 bg-background/20 border-white/20 text-white hover:bg-white/10 w-full"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              {redeemableBonds.length > 0 && (
                <Button
                  onClick={handleRedeemAllBonds}
                  disabled={loading}
                  className="bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg w-full"
                  size="sm"
                >
                  💰 Redeem All (
                  {bondRedemptionService.formatCurrency(totalRedeemableValue)})
                </Button>
              )}
            </div>
          </div>

          {/* Modern Bond List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-white/70">Loading redeemable bonds...</p>
              </div>
            </div>
          ) : redeemableBonds.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No bonds ready for redemption
              </h3>
              <p className="text-brand-neutral mb-6">
                Your bonds will appear here when they mature
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {redeemableBonds.map((bond) => (
                <ModernBondRedemptionCard
                  key={bond.bondID}
                  bond={bond}
                  onRedeem={handleRedeemBond}
                  isRedeeming={redeeming[bond.bondID] || false}
                />
              ))}
            </div>
          )}

          {/* Mobile Sticky Footer */}
          {redeemableBonds.length > 0 && (
            <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t border-white/10">
              <div className="flex gap-3">
                <Button
                  onClick={loadBondData}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-background/20 border-white/20 text-white"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button
                  onClick={handleRedeemAllBonds}
                  disabled={loading}
                  className="flex-1 bg-brand-accent text-white hover:bg-brand-accent/90"
                  size="sm"
                >
                  💰 Redeem All
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pending Bonds Tab */}
      {activeTab === "pending" && (
        <div className="tab-content space-y-6">
          {/* Modern Pending Bonds Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                ⏳ Pending Maturity
              </h2>
              <p className="text-white/70">
                Track your bonds that haven&apos;t matured yet
              </p>
            </div>
            <Button
              onClick={loadBondData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="gap-2 bg-background/20 border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Modern Pending Bonds List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-white/70">Loading pending bonds...</p>
              </div>
            </div>
          ) : pendingBonds.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No pending bonds
              </h3>
              <p className="text-brand-neutral mb-6">
                Mint some bonds to see them here while they mature
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBonds.map((bond) => (
                <ModernBondPendingCard key={bond.bondID} bond={bond} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="tab-content space-y-6">
          {/* Modern Notifications Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                🔔 Maturity Notifications
              </h2>
              <p className="text-white/70">
                Bonds maturing within the next 24 hours
              </p>
            </div>
            <Button
              onClick={loadBondData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="gap-2 bg-background/20 border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Modern Notifications List */}
          {nearingMaturity.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No bonds nearing maturity
              </h3>
              <p className="text-brand-neutral mb-6">
                You&apos;ll be notified when bonds are close to maturity
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {nearingMaturity.map((bond) => (
                <ModernBondNotificationCard key={bond.bondID} bond={bond} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RedeemMain;

// Summary Card Component
const SummaryCard = ({
  title,
  value,
  count,
  color,
}: {
  title: string;
  value: string;
  count: string;
  color: "green" | "blue" | "orange";
}) => {
  const colorClasses = {
    green: "border-success/20 bg-success/5 text-success",
    blue: "border-info/20 bg-info/5 text-info",
    orange: "border-warning/20 bg-warning/5 text-warning",
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-sm opacity-75">{count}</p>
    </div>
  );
};

// Modern Bond Redemption Card Component
const ModernBondRedemptionCard = ({
  bond,
  onRedeem,
  isRedeeming,
}: {
  bond: BondMaturityInfo;
  onRedeem: (bond: BondMaturityInfo) => void;
  isRedeeming: boolean;
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-brand-accent/40 hover:border-brand-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/10">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 via-transparent to-brand-primary/10" />
      <div className="relative z-10 p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center shadow-lg">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Bond #{bond.bondID}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-brand-accent/20 text-brand-accent border-brand-accent/40 text-xs px-2 py-1 inline-flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Ready for Redemption
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-xs text-white/70 mb-1">💰 Principal</div>
                <div className="text-lg font-bold text-white">
                  {bondRedemptionService.formatCurrency(bond.principal)}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-xs text-white/70 mb-1">📈 Yield</div>
                <div className="text-lg font-bold text-brand-accent">
                  {bondRedemptionService.formatCurrency(bond.expectedYield)}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-xs text-white/70 mb-1">💎 Total</div>
                <div className="text-lg font-bold text-brand-accent">
                  {bondRedemptionService.formatCurrency(bond.expectedTotal)}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="text-xs text-white/70 mb-1">⚡ Strategy</div>
                <div className="text-sm font-medium text-white">
                  {bond.strategyID}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
            <Button
              onClick={() => onRedeem(bond)}
              disabled={isRedeeming}
              className="bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              size="lg"
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Redeeming...
                </>
              ) : (
                <>
                  <span className="mr-2">💰</span>
                  Redeem{" "}
                  {bondRedemptionService.formatCurrency(bond.expectedTotal)}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Legacy Bond Redemption Card Component (for backward compatibility)
const BondRedemptionCard = ({
  bond,
  onRedeem,
  isRedeeming,
}: {
  bond: BondMaturityInfo;
  onRedeem: (bond: BondMaturityInfo) => void;
  isRedeeming: boolean;
}) => {
  return (
    <div className="border border-success/20 bg-success/5 rounded-lg p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-success">
            🔗 Bond #{bond.bondID}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-success/80 mt-2">
            <p>
              <span className="font-medium">💰 Principal:</span>{" "}
              {bondRedemptionService.formatCurrency(bond.principal)}
            </p>
            <p>
              <span className="font-medium">📈 Yield:</span>{" "}
              {bondRedemptionService.formatCurrency(bond.expectedYield)}
            </p>
            <p>
              <span className="font-medium">💎 Total:</span>{" "}
              {bondRedemptionService.formatCurrency(bond.expectedTotal)}
            </p>
            <p>
              <span className="font-medium">⚡ Strategy:</span>{" "}
              {bond.strategyID}
            </p>
          </div>
          <div className="mt-2">
            <Badge variant="success" className="text-xs">
              ✅ Ready for Redemption
            </Badge>
          </div>
        </div>
        <Button
          onClick={() => onRedeem(bond)}
          disabled={isRedeeming}
          className="bg-success hover:bg-success/90 text-success-foreground w-full md:w-auto"
          size="lg"
        >
          {isRedeeming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Redeeming...
            </>
          ) : (
            `💰 Redeem ${bondRedemptionService.formatCurrency(
              bond.expectedTotal
            )}`
          )}
        </Button>
      </div>
    </div>
  );
};

// Modern Bond Pending Card Component
const ModernBondPendingCard = ({ bond }: { bond: BondMaturityInfo }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-brand-primary/40 hover:border-brand-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/10">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/10" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Bond #{bond.bondID}
            </h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-brand-primary/20 text-brand-primary border-brand-primary/40 text-xs px-2 py-1">
                ⏳ Maturing{" "}
                {bondRedemptionService.formatDate(bond.maturityDate)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">💰 Principal</div>
            <div className="text-lg font-bold text-white">
              {bondRedemptionService.formatCurrency(bond.principal)}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">📈 Expected Yield</div>
            <div className="text-lg font-bold text-brand-primary">
              {bondRedemptionService.formatCurrency(bond.expectedYield)}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">💎 Expected Total</div>
            <div className="text-lg font-bold text-brand-primary">
              {bondRedemptionService.formatCurrency(bond.expectedTotal)}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">⏰ Time Left</div>
            <div className="text-sm font-medium text-brand-warning">
              {bondRedemptionService.formatTimeRemaining(
                bond.timeUntilMaturity
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Bond Notification Card Component
const ModernBondNotificationCard = ({ bond }: { bond: BondMaturityInfo }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-brand-warning/40 hover:border-brand-warning/60 transition-all duration-300 hover:shadow-lg hover:shadow-brand-warning/10">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-warning/10 via-transparent to-brand-primary/10" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-warning to-brand-primary flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-lg">🔔</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Bond #{bond.bondID} Maturing Soon
            </h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-brand-warning/20 text-brand-warning border-brand-warning/40 text-xs px-2 py-1 animate-pulse">
                ⚠️ Maturing in{" "}
                {bondRedemptionService.formatTimeRemaining(
                  bond.timeUntilMaturity
                )}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">💰 Principal</div>
            <div className="text-lg font-bold text-white">
              {bondRedemptionService.formatCurrency(bond.principal)}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">📈 Expected Yield</div>
            <div className="text-lg font-bold text-brand-warning">
              {bondRedemptionService.formatCurrency(bond.expectedYield)}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">💎 Expected Total</div>
            <div className="text-lg font-bold text-brand-warning">
              {bondRedemptionService.formatCurrency(bond.expectedTotal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Legacy Bond Pending Card Component (for backward compatibility)
const BondPendingCard = ({ bond }: { bond: BondMaturityInfo }) => {
  return (
    <div className="border border-info/20 bg-info/5 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-info">
            🔗 Bond #{bond.bondID}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-info/80 mt-2">
            <p>
              <span className="font-medium">💰 Principal:</span>{" "}
              {bondRedemptionService.formatCurrency(bond.principal)}
            </p>
            <p>
              <span className="font-medium">📈 Expected Yield:</span>{" "}
              {bondRedemptionService.formatCurrency(bond.expectedYield)}
            </p>
            <p>
              <span className="font-medium">💎 Expected Total:</span>{" "}
              {bondRedemptionService.formatCurrency(bond.expectedTotal)}
            </p>
            <p>
              <span className="font-medium">⏰ Time Left:</span>{" "}
              {bondRedemptionService.formatTimeRemaining(
                bond.timeUntilMaturity
              )}
            </p>
          </div>
          <div className="mt-2">
            <Badge variant="info" className="text-xs">
              ⏳ Maturing {bondRedemptionService.formatDate(bond.maturityDate)}
            </Badge>
          </div>
        </div>
        <div className="text-info text-3xl">⏰</div>
      </div>
    </div>
  );
};
