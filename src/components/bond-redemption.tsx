"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as fcl from "@onflow/fcl";
import { useFlowCurrentUser } from "@onflow/kit";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Loader2, Clock, DollarSign, Bell, RefreshCw, Wallet } from "lucide-react";
import { bondRedemptionService, type BondMaturityInfo } from "@/lib/bond-redemption-service";

export default function BondRedemption() {
  const { user } = useFlowCurrentUser();
  const [activeTab, setActiveTab] = useState<'redeemable' | 'pending' | 'notifications'>('redeemable');
  
  // Bond states
  const [redeemableBonds, setRedeemableBonds] = useState<BondMaturityInfo[]>([]);
  const [pendingBonds, setPendingBonds] = useState<BondMaturityInfo[]>([]);
  const [nearingMaturity, setNearingMaturity] = useState<BondMaturityInfo[]>([]);
  const [totalRedeemableValue, setTotalRedeemableValue] = useState<number>(0);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState<{[key: number]: boolean}>({});

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
      console.log("🔍 Loading bond redemption data...");

      // Load all bond data in parallel
      const [redeemable, pending, nearing, totalValue] = await Promise.all([
        bondRedemptionService.getRedeemableBonds(user.addr),
        getAllPendingBonds(),
        bondRedemptionService.getBondsNearingMaturity(user.addr, 24),
        bondRedemptionService.getTotalRedeemableValue(user.addr)
      ]);

      setRedeemableBonds(redeemable);
      setPendingBonds(pending);
      setNearingMaturity(nearing);
      setTotalRedeemableValue(totalValue);

      console.log(`📊 Loaded: ${redeemable.length} redeemable, ${pending.length} pending, ${nearing.length} nearing maturity`);
    } catch (error) {
      console.error("Error loading bond data:", error);
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
        args: (arg: any, t: any) => [arg(user?.addr, t.Address)]
      });

      if (!bondIDs || bondIDs.length === 0) return [];

      const maturityPromises = bondIDs.map((bondID: number) => 
        bondRedemptionService.checkBondMaturity(user?.addr || "", bondID.toString())
      );

      const maturityResults = await Promise.all(maturityPromises);
      
      return maturityResults.filter((bond): bond is BondMaturityInfo => 
        bond !== null && !bond.isMatured
      );
    } catch (error) {
      console.error("Error getting pending bonds:", error);
      return [];
    }
  };

  // ✅ REDEEM BOND HANDLER
  const handleRedeemBond = async (bond: BondMaturityInfo) => {
    if (!bond.isMatured) {
      setError("Bond is not yet matured for redemption");
      return;
    }

    const confirmMessage = `Redeem Bond #${bond.bondID}?\n\n` +
      `Principal: ${bondRedemptionService.formatCurrency(bond.principal)}\n` +
      `Yield: ${bondRedemptionService.formatCurrency(bond.expectedYield)}\n` +
      `Total: ${bondRedemptionService.formatCurrency(bond.expectedTotal)}`;

    if (!confirm(confirmMessage)) return;

    setRedeeming(prev => ({ ...prev, [bond.bondID]: true }));
    setError(null);

    try {
      console.log(`💰 Redeeming bond ${bond.bondID}...`);
      
      const result = await bondRedemptionService.redeemBond(bond.bondID.toString());

      if (result.success) {
        setSuccess(`✅ Successfully redeemed Bond #${bond.bondID} for ${bondRedemptionService.formatCurrency(bond.expectedTotal)}!`);
        console.log("✅ Bond redeemed successfully");
        await loadBondData(); // Refresh data

        // Auto-clear success after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        throw new Error(result.error || "Redemption failed");
      }
    } catch (error: unknown) {
      console.error("❌ Error redeeming bond:", error);
      setError(error instanceof Error ? `❌ Failed to redeem bond: ${error.message}` : '❌ Failed to redeem bond');
    } finally {
      setRedeeming(prev => ({ ...prev, [bond.bondID]: false }));
    }
  };

  // ✅ REDEEM ALL BONDS HANDLER
  const handleRedeemAllBonds = async () => {
    if (redeemableBonds.length === 0) return;

    const confirmMessage = `Redeem all ${redeemableBonds.length} matured bonds?\n\n` +
      `Total value: ${bondRedemptionService.formatCurrency(totalRedeemableValue)}`;

    if (!confirm(confirmMessage)) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`💰 Redeeming ${redeemableBonds.length} bonds...`);
      
      const redemptionPromises = redeemableBonds.map(bond => 
        bondRedemptionService.redeemBond(bond.bondID.toString())
      );

      const results = await Promise.all(redemptionPromises);
      const successful = results.filter(r => r.success).length;
      const failed = results.length - successful;

      if (successful > 0) {
        setSuccess(`✅ Successfully redeemed ${successful} bonds for ${bondRedemptionService.formatCurrency(totalRedeemableValue)}!`);
      }
      
      if (failed > 0) {
        setError(`❌ Failed to redeem ${failed} bonds`);
      }

      await loadBondData(); // Refresh data
    } catch (error: unknown) {
      console.error("❌ Error redeeming bonds:", error);
      setError(error instanceof Error ? `❌ Failed to redeem bonds: ${error.message}` : '❌ Failed to redeem bonds');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
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
            <h3 className="text-2xl font-bold mb-4 gradient-text">Connect Wallet to Redeem Bonds</h3>
            <p className="text-muted-foreground mb-6">
              Please connect your Flow wallet to view and redeem your bonds
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="app-container space-y-8">
      {/* Bond Redemption Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="card-professional">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text">Bond Redemption Center</CardTitle>
                <CardDescription>Redeem your matured bonds and track upcoming maturities</CardDescription>
              </div>
            </div>
            <Badge variant="success" className="w-fit">
              🚀 Live Mode - Real Blockchain Transactions
            </Badge>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="💰 Ready to Redeem"
            value={bondRedemptionService.formatCurrency(totalRedeemableValue)}
            count={`${redeemableBonds.length} bonds`}
            color="green"
          />
          <SummaryCard
            title="⏳ Pending Maturity"
            value={`${pendingBonds.length} bonds`}
            count={`Total value when mature`}
            color="blue"
          />
          <SummaryCard
            title="🔔 Nearing Maturity"
            value={`${nearingMaturity.length} bonds`}
            count="Within 24 hours"
            color="orange"
          />
        </div>
      </motion.div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-error/10 text-error border border-error/20 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearMessages} className="text-error hover:text-error/80">×</button>
          </div>
        </motion.div>
      )}
      
      {success && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-success/10 text-success border border-success/20 px-4 py-3 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button onClick={clearMessages} className="text-success hover:text-success/80">×</button>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
          {[
            { key: 'redeemable', label: '💰 Ready to Redeem', count: redeemableBonds.length },
            { key: 'pending', label: '⏳ Pending Bonds', count: pendingBonds.length },
            { key: 'notifications', label: '🔔 Notifications', count: nearingMaturity.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'redeemable' | 'pending' | 'notifications')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-card text-primary shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Redeemable Bonds Tab */}
      {activeTab === 'redeemable' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="card-professional">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-semibold">💰 Bonds Ready for Redemption</CardTitle>
                  <CardDescription>Redeem your matured bonds to receive principal + yield</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={loadBondData}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  {redeemableBonds.length > 0 && (
                    <Button
                      onClick={handleRedeemAllBonds}
                      disabled={loading}
                      className="btn-primary"
                      size="sm"
                    >
                      💰 Redeem All ({bondRedemptionService.formatCurrency(totalRedeemableValue)})
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
                  <span>🔍 Loading redeemable bonds...</span>
                </div>
              ) : redeemableBonds.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No bonds ready for redemption</h3>
                  <p className="text-muted-foreground mb-6">
                    Your bonds will appear here when they mature
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {redeemableBonds.map((bond) => (
                    <BondRedemptionCard
                      key={bond.bondID}
                      bond={bond}
                      onRedeem={handleRedeemBond}
                      isRedeeming={redeeming[bond.bondID] || false}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Pending Bonds Tab */}
      {activeTab === 'pending' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="card-professional">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-semibold">⏳ Bonds Pending Maturity</CardTitle>
                  <CardDescription>Track your bonds that haven&apos;t matured yet</CardDescription>
                </div>
                <Button
                  onClick={loadBondData}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
                  <span>🔍 Loading pending bonds...</span>
                </div>
              ) : pendingBonds.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No pending bonds</h3>
                  <p className="text-muted-foreground">
                    Mint some bonds to see them here while they mature
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBonds.map((bond) => (
                    <BondPendingCard key={bond.bondID} bond={bond} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="card-professional">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-semibold">🔔 Maturity Notifications</CardTitle>
                  <CardDescription>Bonds maturing within the next 24 hours</CardDescription>
                </div>
                <Button
                  onClick={loadBondData}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {nearingMaturity.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                    <Bell className="w-8 h-8 text-muted-foreground" />
                  </div>
                                     <h3 className="text-lg font-semibold mb-2">No bonds nearing maturity</h3>
                   <p className="text-muted-foreground">
                     You&apos;ll be notified when bonds are close to maturity
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {nearingMaturity.map((bond) => (
                    <motion.div
                      key={bond.bondID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border border-warning/20 bg-warning/10 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-warning">🔔 Bond #{bond.bondID} Maturing Soon</h3>
                          <p className="text-sm text-warning/80">
                            Matures in {bondRedemptionService.formatTimeRemaining(bond.timeUntilMaturity)}
                          </p>
                          <p className="text-sm text-warning/80">
                            Expected return: {bondRedemptionService.formatCurrency(bond.expectedTotal)}
                          </p>
                        </div>
                        <div className="text-warning text-2xl">⏰</div>
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
}

// Summary Card Component
const SummaryCard = ({ title, value, count, color }: {
  title: string;
  value: string;
  count: string;
  color: 'green' | 'blue' | 'orange';
}) => {
  const colorClasses = {
    green: 'border-success/20 bg-success/5 text-success',
    blue: 'border-info/20 bg-info/5 text-info',
    orange: 'border-warning/20 bg-warning/5 text-warning'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-lg p-4 ${colorClasses[color]}`}
    >
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-sm opacity-75">{count}</p>
    </motion.div>
  );
};

// Bond Redemption Card Component
const BondRedemptionCard = ({ bond, onRedeem, isRedeeming }: {
  bond: BondMaturityInfo;
  onRedeem: (bond: BondMaturityInfo) => void;
  isRedeeming: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-success/20 bg-success/5 rounded-lg p-4"
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-success">🔗 Bond #{bond.bondID}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-success/80 mt-2">
            <p><span className="font-medium">💰 Principal:</span> {bondRedemptionService.formatCurrency(bond.principal)}</p>
            <p><span className="font-medium">📈 Yield:</span> {bondRedemptionService.formatCurrency(bond.expectedYield)}</p>
            <p><span className="font-medium">💎 Total:</span> {bondRedemptionService.formatCurrency(bond.expectedTotal)}</p>
            <p><span className="font-medium">⚡ Strategy:</span> {bond.strategyID}</p>
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
          className="bg-success hover:bg-success/90 text-success-foreground"
          size="lg"
        >
          {isRedeeming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Redeeming...
            </>
          ) : (
            `💰 Redeem ${bondRedemptionService.formatCurrency(bond.expectedTotal)}`
          )}
        </Button>
      </div>
    </motion.div>
  );
};

// Bond Pending Card Component
const BondPendingCard = ({ bond }: {
  bond: BondMaturityInfo;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-info/20 bg-info/5 rounded-lg p-4"
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-info">🔗 Bond #{bond.bondID}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-info/80 mt-2">
            <p><span className="font-medium">💰 Principal:</span> {bondRedemptionService.formatCurrency(bond.principal)}</p>
            <p><span className="font-medium">📈 Expected Yield:</span> {bondRedemptionService.formatCurrency(bond.expectedYield)}</p>
            <p><span className="font-medium">💎 Expected Total:</span> {bondRedemptionService.formatCurrency(bond.expectedTotal)}</p>
            <p><span className="font-medium">⏰ Time Left:</span> {bondRedemptionService.formatTimeRemaining(bond.timeUntilMaturity)}</p>
          </div>
          <div className="mt-2">
            <Badge variant="info" className="text-xs">
              ⏳ Maturing {bondRedemptionService.formatDate(bond.maturityDate)}
            </Badge>
          </div>
        </div>
        <div className="text-info text-3xl">⏰</div>
      </div>
    </motion.div>
  );
}; 