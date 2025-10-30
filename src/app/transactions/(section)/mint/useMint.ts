"use client";

import { useState, useEffect } from "react";
import { useFlowCurrentUser } from "@onflow/kit";
import { chronoBondService } from "@/lib/chronobond-service";
import { swapService } from "@/lib/swap-service";
import { type MintHooksReturn, type TransactionStatus, type DurationOption } from "@/types/mint.types";
import { type YieldStrategy } from "@/types/chronobond";

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

const DURATION_OPTIONS: DurationOption[] = [
  { value: 0.000001, label: "1 Day", multiplier: 1 },
  { value: 30, label: "30 Days", multiplier: 1.0 },
  { value: 90, label: "3 Months", multiplier: 1.2 },
  { value: 180, label: "6 Months", multiplier: 1.5 },
  { value: 365, label: "1 Year", multiplier: 2.0 },
];

export const useMint = (): MintHooksReturn => {
  const { user } = useFlowCurrentUser();
  
  const [formData, setFormData] = useState({
    strategyID: "FlowStaking",
    amount: "",
    lockupPeriod: 30,
  });

  const [txStatus, setTxStatus] = useState<TransactionStatus>({
    state: "idle",
    statusString: "",
    txId: null,
  });

  // Cross-asset mint state
  const [paymentToken, setPaymentToken] = useState<"FLOW" | "USDC">("FLOW");
  const [usdcQuote, setUsdcQuote] = useState<string | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

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

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchQuote = async () => {
      if (paymentToken !== "USDC") {
        setUsdcQuote(null);
        return;
      }
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        setUsdcQuote(null);
        return;
      }
      setQuoteLoading(true);
      const quote = await swapService.quoteIn({
        fromToken: "USDC",
        toToken: "FLOW",
        toTokenAmount: formData.amount,
      });
      setQuoteLoading(false);
      if (quote?.inputAmount) {
        setUsdcQuote(`~${parseFloat(quote.inputAmount).toFixed(2)} USDC`);
      } else {
        setUsdcQuote(null);
      }
    };
    fetchQuote();
  }, [paymentToken, formData.amount]);

  // Execute mint flow
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
        statusString: paymentToken === "USDC" ? "Minting with USDC..." : "Minting bond...",
        txId: null,
      });

      const lockupSeconds = (formData.lockupPeriod * 24 * 60 * 60).toString();
      const mintResult =
        paymentToken === "USDC"
          ? await chronoBondService.mintWithSwap(
              formData.strategyID,
              formData.amount || "0",
              lockupSeconds,
              "USDC"
            )
          : await chronoBondService.mintBond(
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
        setPaymentToken("FLOW");
        setUsdcQuote(null);
        setTxStatus({
          state: "idle",
          statusString: "",
          txId: null,
        });
      }, 5000);
    } catch (error: unknown) {
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

  return {
    // State
    formData,
    txStatus,
    selectedStrategy,
    selectedDuration,
    estimatedYield,
    
    // Actions
    handleInputChange,
    handleMintBond,
    setPaymentToken,
    // expose for UI
    paymentToken,
    usdcQuote,
    quoteLoading,
    // Constants
    
    yieldStrategies: YIELD_STRATEGIES,
    durationOptions: DURATION_OPTIONS
  };
};
