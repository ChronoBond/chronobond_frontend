"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useFlowCurrentUser } from "@onflow/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Coins,
  Clock,
  TrendingUp,
  Loader2,
  Shield,
  AlertCircle,
  DollarSign,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { MintBondParams, YieldStrategy } from "@/types/chronobond";
import { chronoBondService } from "@/lib/chronobond-service";

const YIELD_STRATEGIES: YieldStrategy[] = [
  {
    name: "FlowStaking",
    description: "Low-risk staking strategy with consistent yields",
    expectedYield: "5.0%",
    riskLevel: "LOW",
  },
  {
    name: "DeFiYield",
    description: "Medium-risk DeFi strategy with higher yields",
    expectedYield: "8.5%",
    riskLevel: "MEDIUM",
  },
  {
    name: "HighYield",
    description: "High-risk strategy for maximum returns",
    expectedYield: "15.0%",
    riskLevel: "HIGH",
  },
];

const DURATION_OPTIONS = [
  { value: 0.000001, label: "1 Day", multiplier: 1 },
  { value: 30, label: "30 Days", multiplier: 1.0 },
  { value: 90, label: "3 Months", multiplier: 1.2 },
  { value: 180, label: "6 Months", multiplier: 1.5 },
  { value: 365, label: "1 Year", multiplier: 2.0 },
];

// Real transaction states
type TransactionState =
  | "idle"
  | "checking"
  | "setup"
  | "minting"
  | "success"
  | "error";

interface TransactionStatus {
  state: TransactionState;
  statusString: string;
  txId: string | null;
}

const MintMain = () => {
  const { user } = useFlowCurrentUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<MintBondParams>({
    strategyID: "FlowStaking",
    amount: "",
    lockupPeriod: 30,
  });

  const [txStatus, setTxStatus] = useState<TransactionStatus>({
    state: "idle",
    statusString: "",
    txId: null,
  });

  useEffect(() => {
    if (containerRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
      
      if (headerRef.current) {
        tl.fromTo(headerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        );
      }
      
      if (formRef.current) {
        tl.fromTo(formRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2"
        );
      }
      
      if (summaryRef.current) {
        tl.fromTo(summaryRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.1"
        );
      }
    }
  }, []);

  // Reveal animation when component mounts
  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.reveal-item');
    if (elements && elements.length > 0) {
      gsap.fromTo(elements, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, []);

  const handleInputChange = (
    field: keyof MintBondParams,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Complete mint bond flow using the service
  const handleMintBond = async () => {
    if (!user?.loggedIn) {
      alert("Please connect your wallet first");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      // Step 1: Check account setup
      setTxStatus({
        state: "checking",
        statusString: "Checking account setup...",
        txId: null,
      });

      const isSetup = await chronoBondService.checkAccountSetup(
        user.addr || ""
      );

      if (!isSetup) {
        // Step 2: Setup account if needed
        setTxStatus({
          state: "setup",
          statusString: "Setting up account for ChronoBond...",
          txId: null,
        });

        const setupResult = await chronoBondService.setupAccount();
        if (!setupResult.success) {
          throw new Error(setupResult.error || "Failed to setup account");
        }
      }

      // Step 3: Mint the bond
      setTxStatus({
        state: "minting",
        statusString: "Minting bond...",
        txId: null,
      });

      const lockupSeconds = (formData.lockupPeriod * 24 * 60 * 60).toString();
      const mintResult = await chronoBondService.mintBond(
        formData.strategyID,
        formData.amount || "0",
        lockupSeconds
      );

      if (!mintResult.success) {
        throw new Error(mintResult.error || "Failed to mint bond");
      }

      // Step 4: Success
      setTxStatus({
        state: "success",
        statusString: "Bond minted successfully!",
        txId: mintResult.transactionId || null,
      });

      // Reset form after success
      setTimeout(() => {
        setFormData({
          strategyID: "FlowStaking",
          amount: "",
          lockupPeriod: 30,
        });
        setTxStatus({
          state: "idle",
          statusString: "",
          txId: null,
        });
      }, 5000);
    } catch (error: unknown) {
      /* console.error("Error in mint bond flow:", error); */

      setTxStatus({
        state: "error",
        statusString:
          error instanceof Error ? error.message : "Transaction failed",
        txId: null,
      });

      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setTxStatus({
          state: "idle",
          statusString: "",
          txId: null,
        });
      }, 5000);
    }
  };

  const selectedStrategy = YIELD_STRATEGIES.find(
    (s) => s.name === formData.strategyID
  );
  const selectedDuration = DURATION_OPTIONS.find(
    (d) => d.value === formData.lockupPeriod
  );
  const estimatedYield = formData.amount
    ? (
        ((parseFloat(formData.amount) *
          parseFloat(selectedStrategy?.expectedYield || "0")) /
          100) *
        (selectedDuration?.multiplier || 1)
      ).toFixed(4)
    : "0.0000";

  if (!user?.loggedIn) {
    return (
      <div className="app-container">
        <div>
          <Card className="card-professional mx-auto max-w-md">
            <CardContent className="p-12 text-center">
              <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Wallet className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                Connect Wallet to Mint Bonds
              </h3>
              <p className="text-muted-foreground mb-6">
                Please connect your Flow wallet to start minting time-locked
                bonds
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="app-container max-w-6xl mx-auto">
        <Card className="card-professional reveal-item">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Coins className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold gradient-text">
                  Mint ChronoBond
                </CardTitle>
                <CardDescription className="text-lg">
                  Create time-locked bonds with guaranteed yields
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div ref={formRef} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Principal Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChange={(e) =>
                          handleInputChange("amount", e.target.value)
                        }
                        className="pl-10 pr-16 text-lg h-12"
                        min="0"
                        step="0.01"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                        FLOW
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Yield Strategy
                    </label>
                    <Select
                      value={formData.strategyID}
                      onValueChange={(value) =>
                        handleInputChange("strategyID", value)
                      }
                    >
                      {YIELD_STRATEGIES.map((strategy) => (
                        <option key={strategy.name} value={strategy.name}>
                          {strategy.name} - {strategy.expectedYield}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Lock-up Period
                    </label>
                    <Select
                      value={formData.lockupPeriod.toString()}
                      onValueChange={(value) =>
                        handleInputChange("lockupPeriod", parseInt(value))
                      }
                    >
                      {DURATION_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <Button
                    onClick={handleMintBond}
                    disabled={
                      !formData.amount ||
                      parseFloat(formData.amount) <= 0 ||
                      ["checking", "setup", "minting"].includes(txStatus.state)
                    }
                    className="w-full btn-primary h-12 text-lg"
                    size="lg"
                  >
                    {txStatus.state === "checking" && (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Checking Account...
                      </>
                    )}
                    {txStatus.state === "setup" && (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Setting Up Account...
                      </>
                    )}
                    {txStatus.state === "minting" && (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Minting Bond...
                      </>
                    )}
                    {txStatus.state === "idle" && (
                      <>
                        <Coins className="w-5 h-5 mr-2" />
                        Mint Bond
                      </>
                    )}
                    {txStatus.state === "success" && (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Bond Minted!
                      </>
                    )}
                    {txStatus.state === "error" && (
                      <>
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Retry
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Right Column - Strategy Details and Yield Calculator */}
              <div ref={summaryRef} className="space-y-6">
                {/* Strategy Details */}
                <div className="reveal-item">
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {selectedStrategy?.name} Strategy
                      </CardTitle>
                      <Badge
                        variant={
                          selectedStrategy?.riskLevel === "LOW"
                            ? "success"
                            : selectedStrategy?.riskLevel === "MEDIUM"
                            ? "warning"
                            : "error"
                        }
                        className="w-fit"
                      >
                        {selectedStrategy?.riskLevel} RISK
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedStrategy?.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-success font-semibold">
                          {selectedStrategy?.expectedYield} Expected APY
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Yield Calculator */}
                <div className="reveal-item">
                  <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Yield Calculator
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {formData.amount || "0.00"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Principal
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold text-success">
                            +{estimatedYield}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Est. Yield
                          </div>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg border border-success/20">
                        <div className="text-3xl font-bold gradient-text mb-1">
                          {(
                            parseFloat(formData.amount || "0") +
                            parseFloat(estimatedYield)
                          ).toFixed(4)}{" "}
                          FLOW
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total at Maturity ({selectedDuration?.label})
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Transaction Status */}
            {txStatus.statusString && (
              <div className={`p-4 rounded-lg border ${
                  txStatus.state === "success"
                    ? "bg-success/10 text-success border-success/20"
                    : txStatus.state === "error"
                    ? "bg-error/10 text-error border-error/20"
                    : "bg-primary/10 text-primary border-primary/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {["checking", "setup", "minting"].includes(
                    txStatus.state
                  ) && <Loader2 className="w-5 h-5 animate-spin" />}
                  {txStatus.state === "success" && (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {txStatus.state === "error" && (
                    <AlertCircle className="w-5 h-5" />
                  )}
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
          </CardContent>
        </Card>
    </div>
  );
};

export default MintMain;
