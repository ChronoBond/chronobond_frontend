"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useFlowCurrentUser } from "@onflow/kit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Clock, 
  TrendingUp, 
  Tag, 
  Loader2, 
  Wallet, 
  DollarSign, 
  X, 
  CheckCircle,
  Link as LinkIcon,
  AlertTriangle,
  Bell,
  RefreshCw
} from "lucide-react";
import { chronoBondService, type BondData, type BondDetails } from "@/lib/chronobond-service";
import { bondRedemptionService } from "@/lib/bond-redemption-service";
import { marketplaceService } from "@/lib/marketplace-service";

// Real transaction state
type ListingState = 'idle' | 'pending' | 'success' | 'error'

interface ListingStatus {
  state: ListingState
  statusString: string
  txId: string | null
}

const HoldingsMain = () => {
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
            <h3 className="text-2xl font-bold mb-4 gradient-text">Connect Wallet to View Holdings</h3>
            <p className="text-muted-foreground mb-6">
              Please connect your Flow wallet to view your bond portfolio
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="app-container">
        <Card className="card-professional">
          <CardContent className="p-12">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-lg">Loading your bond portfolio...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalValue = bonds.reduce((sum, bond) => sum + bond.principal, 0);
  const totalYield = bonds.reduce((sum, bond) => sum + calculateCurrentYield(bond), 0);

  return (
    <div className="app-container space-y-8">
      {/* Modern Portfolio Summary */}
      <div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-white/10 p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-brand-primary/70 bg-clip-text text-transparent">
                  My Holdings
                </h1>
                <p className="text-brand-neutral text-lg">
                  Your ChronoBond portfolio overview
                </p>
              </div>
            </div>
            
            {/* Modern Portfolio Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                    <LinkIcon className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{bonds.length}</div>
                    <div className="text-sm text-brand-neutral">Total Bonds</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-brand-accent">{formatFlow(totalValue)}</div>
                    <div className="text-sm text-brand-neutral">Total Principal</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-warning/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-brand-warning" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-brand-warning">{formatFlow(totalYield)}</div>
                    <div className="text-sm text-brand-neutral">Expected Yield</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Bonds Portfolio */}
      <div className="space-y-6">
        {/* Modern Portfolio Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              📊 Bond Portfolio
            </h2>
            <p className="text-white/70">
              Manage your time-locked bonds and list them for sale on the marketplace
            </p>
          </div>
          <Button 
            onClick={loadUserBonds}
            variant="outline"
            size="sm"
            className="gap-2 bg-background/20 border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
        {/* Modern Bonds List */}
        {bonds.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No bonds found
            </h3>
            <p className="text-brand-neutral mb-6">
              Start by minting your first bond to see it here
            </p>
            <Button 
              variant="outline"
              className="bg-background/20 border-white/20 text-white hover:bg-white/10"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Mint Your First Bond
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bonds.map((bond, index) => (
              <ModernBondHoldingCard
                key={bond.id}
                bond={bond}
                onListBond={() => handleListBond(bond)}
                onRedeemBond={() => handleRedeemBond(bond)}
                isMatured={isMatured(bond.maturityDate)}
                formatFlow={formatFlow}
                formatDate={formatDate}
                calculateCurrentYield={calculateCurrentYield}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modern Listing Modal */}
      {showListingForm && selectedBond && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-mobile">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-white/10 p-6 max-w-md w-full shadow-2xl modal-content-mobile">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">List Bond for Sale</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowListingForm(false);
                    setSelectedBond(null);
                    setSelectedBondDetails(null);
                    setListingPrice("");
                    setListingState({
                      state: 'idle',
                      statusString: '',
                      txId: null
                    });
                  }}
                  className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            
              <div className="space-y-4">
                <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-lg p-3 text-center">
                  <span className="text-brand-accent text-sm font-medium">
                    🚀 Real Transaction - Will execute on Flow blockchain
                  </span>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Bond ID:</span>
                      <span className="font-medium text-white">#{selectedBond.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Principal:</span>
                      <span className="font-medium text-white">{formatFlow(selectedBond.principal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Yield Rate:</span>
                      <Badge className="bg-brand-primary/20 text-brand-primary border-brand-primary/40 text-xs">
                        {(selectedBond.yieldRate * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Strategy:</span>
                      <span className="font-medium text-white">{selectedBond.strategyID}</span>
                    </div>
                    {selectedBondDetails && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Expected Total:</span>
                          <span className="font-medium text-brand-accent">{formatFlow(selectedBondDetails.expectedTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Time to Maturity:</span>
                          <span className="font-medium text-white">
                            {selectedBondDetails.isMatured ? "Matured" : chronoBondService.formatTimeUntilMaturity(selectedBondDetails.timeUntilMaturity)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white">
                    Listing Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <Input
                      type="number"
                      placeholder="Enter price"
                      value={listingPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setListingPrice(e.target.value)}
                      min="0"
                      step="0.01"
                      className="pl-10 pr-16 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-white/70 bg-white/10 px-2 py-1 rounded">
                      FLOW
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleConfirmListing}
                    disabled={listingState.state === 'pending' || !listingPrice || parseFloat(listingPrice) <= 0 || isNaN(parseFloat(listingPrice))}
                    className="flex-1 bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg"
                  >
                    {listingState.state === 'pending' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Listing"
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowListingForm(false);
                      setSelectedBond(null);
                      setSelectedBondDetails(null);
                      setListingPrice("");
                      setListingState({
                        state: 'idle',
                        statusString: '',
                        txId: null
                      });
                    }}
                    variant="outline"
                    className="flex-1 bg-background/20 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              
                {listingState.statusString && (
                  <div className={`p-3 rounded-lg text-sm border ${
                    listingState.state === 'success' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' :
                    listingState.state === 'error' ? 'bg-brand-error/10 text-brand-error border-brand-error/20' :
                    'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                  }`}>
                    <div className="flex items-center gap-2">
                      {listingState.state === 'pending' && <Loader2 className="w-4 h-4 animate-spin" />}
                      {listingState.state === 'success' && <CheckCircle className="w-4 h-4" />}
                      <span>{listingState.statusString}</span>
                    </div>
                    {listingState.txId && (
                      <div className="text-xs mt-1 opacity-70">
                        TX ID: {listingState.txId}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoldingsMain;

// Modern Bond Holding Card Component
const ModernBondHoldingCard = ({
  bond,
  onListBond,
  onRedeemBond,
  isMatured,
  formatFlow,
  formatDate,
  calculateCurrentYield
}: {
  bond: BondData;
  onListBond: () => void;
  onRedeemBond: () => void;
  isMatured: boolean;
  formatFlow: (amount: number) => string;
  formatDate: (timestamp: number) => string;
  calculateCurrentYield: (bond: BondData) => number;
}) => {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border transition-all duration-300 hover:shadow-lg ${
      isMatured 
        ? 'border-brand-accent/40 hover:border-brand-accent/60 hover:shadow-brand-accent/10' 
        : 'border-brand-primary/40 hover:border-brand-primary/60 hover:shadow-brand-primary/10'
    }`}>
      <div className={`absolute inset-0 ${
        isMatured 
          ? 'bg-gradient-to-br from-brand-accent/10 via-transparent to-brand-primary/10' 
          : 'bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/10'
      }`} />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg ${
            isMatured 
              ? 'from-brand-accent to-brand-primary' 
              : 'from-brand-primary to-brand-accent'
          }`}>
            <LinkIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bond #{bond.id}</h3>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs px-2 py-1 ${
                isMatured 
                  ? 'bg-brand-accent/20 text-brand-accent border-brand-accent/40' 
                  : 'bg-brand-primary/20 text-brand-primary border-brand-primary/40'
              }`}>
                {isMatured ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Matured
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
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
            <div className="text-lg font-bold text-white">{formatFlow(bond.principal)}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">📈 Yield Rate</div>
            <div className="text-lg font-bold text-brand-primary">{(bond.yieldRate * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">⚡ Strategy</div>
            <div className="text-sm font-medium text-white">{bond.strategyID}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">📅 Maturity</div>
            <div className="text-sm font-medium text-white">{formatDate(bond.maturityDate)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">📊 Expected Yield</div>
            <div className="text-lg font-bold text-brand-accent">{formatFlow(calculateCurrentYield(bond))}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-xs text-white/70 mb-1">💎 Total Value</div>
            <div className="text-lg font-bold text-brand-accent">{formatFlow(bond.principal + calculateCurrentYield(bond))}</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {!isMatured && (
            <Button
              onClick={onListBond}
              className="bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg w-full sm:w-auto"
              size="lg"
            >
              <Tag className="w-4 h-4 mr-2" />
              List for Sale
            </Button>
          )}
          {isMatured && (
            <Button
              onClick={onRedeemBond}
              className="bg-brand-accent text-white hover:bg-brand-accent/90 shadow-lg w-full sm:w-auto"
              size="lg"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Redeem Bond
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
