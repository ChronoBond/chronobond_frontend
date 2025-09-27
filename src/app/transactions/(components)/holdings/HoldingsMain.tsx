"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useFlowCurrentUser } from "@onflow/kit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, TrendingUp, Tag, Loader2, Wallet, DollarSign, X, CheckCircle } from "lucide-react";
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
      {/* Portfolio Summary */}
      <div
      >
        <Card className="card-professional">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold gradient-text">My Holdings</CardTitle>
                <CardDescription>Your ChronoBond portfolio overview</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="text-center p-6 rounded-lg bg-primary/5 border border-primary/20"
              >
                <div className="text-3xl font-bold text-primary mb-2">{bonds.length}</div>
                <div className="text-sm text-muted-foreground">Total Bonds</div>
              </div>
              
              <div
                className="text-center p-6 rounded-lg bg-success/5 border border-success/20"
              >
                <div className="text-3xl font-bold text-success mb-2">{formatFlow(totalValue)}</div>
                <div className="text-sm text-muted-foreground">Total Principal</div>
              </div>
              
              <div
                className="text-center p-6 rounded-lg bg-warning/5 border border-warning/20"
              >
                <div className="text-3xl font-bold text-warning mb-2">{formatFlow(totalYield)}</div>
                <div className="text-sm text-muted-foreground">Expected Yield</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bonds Table */}
      <div
      >
        <Card className="card-professional">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Bond Portfolio</CardTitle>
                <CardDescription>
                  Manage your time-locked bonds and list them for sale on the marketplace
                </CardDescription>
              </div>
              <Button 
                onClick={loadUserBonds}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {bonds.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No bonds found</h3>
                <p className="text-muted-foreground mb-6">
                  Start by minting your first bond to see it here
                </p>
                <Button variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Mint Your First Bond
                </Button>
              </div>
            ) : (
              <div className="table-professional">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bond ID</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Yield Rate</TableHead>
                      <TableHead>Strategy</TableHead>
                      <TableHead>Maturity Date</TableHead>
                      <TableHead>Expected Yield</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bonds.map((bond, index) => (
                      <tr
                        key={bond.id}
                      >
                        <TableCell className="font-medium">
                          #{bond.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            {formatFlow(bond.principal)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="info" className="font-medium">
                            {(bond.yieldRate * 100).toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{bond.strategyID}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(bond.maturityDate)}
                        </TableCell>
                        <TableCell>
                          <span className="text-success font-medium">
                            {formatFlow(calculateCurrentYield(bond))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={isMatured(bond.maturityDate) ? "success" : "warning"}
                            className="capitalize"
                          >
                            {isMatured(bond.maturityDate) ? "Matured" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!isMatured(bond.maturityDate) && (
                              <Button
                                onClick={() => handleListBond(bond)}
                                variant="outline"
                                size="sm"
                                className="h-8"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                List for Sale
                              </Button>
                            )}
                            {isMatured(bond.maturityDate) && (
                              <Button
                                onClick={() => handleRedeemBond(bond)}
                                variant="default"
                                size="sm"
                                className="h-8 btn-primary"
                              >
                                <DollarSign className="w-3 h-3 mr-1" />
                                Redeem Bond
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Listing Modal */}
      {showListingForm && selectedBond && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-mobile">
          <div
            className="bg-card/95 backdrop-blur-xl p-4 sm:p-6 rounded-lg max-w-md w-full border border-border/40 shadow-2xl modal-content-mobile"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold gradient-text">List Bond for Sale</h3>
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
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Badge variant="success" className="w-full justify-center">
                🚀 Real Transaction - Will execute on Flow blockchain
              </Badge>
              
              <div className="p-4 bg-muted/20 rounded-lg border border-border/40">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bond ID:</span>
                    <span className="font-medium">#{selectedBond.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Principal:</span>
                    <span className="font-medium">{formatFlow(selectedBond.principal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Yield Rate:</span>
                    <Badge variant="info" className="text-xs">{(selectedBond.yieldRate * 100).toFixed(1)}%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Strategy:</span>
                    <span className="font-medium">{selectedBond.strategyID}</span>
                  </div>
                  {selectedBondDetails && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Expected Total:</span>
                        <span className="font-medium text-success">{formatFlow(selectedBondDetails.expectedTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time to Maturity:</span>
                        <span className="font-medium">
                          {selectedBondDetails.isMatured ? "Matured" : chronoBondService.formatTimeUntilMaturity(selectedBondDetails.timeUntilMaturity)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Listing Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter price"
                    value={listingPrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setListingPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    className="pl-10 pr-16"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    FLOW
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleConfirmListing}
                  disabled={listingState.state === 'pending' || !listingPrice || parseFloat(listingPrice) <= 0 || isNaN(parseFloat(listingPrice))}
                  className="flex-1 btn-primary"
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
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
              
              {listingState.statusString && (
                <div className={`p-3 rounded-lg text-sm border ${
                  listingState.state === 'success' ? 'bg-success/10 text-success border-success/20' :
                  listingState.state === 'error' ? 'bg-error/10 text-error border-error/20' :
                  'bg-primary/10 text-primary border-primary/20'
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
      )}
    </div>
  );
};

export default HoldingsMain;
