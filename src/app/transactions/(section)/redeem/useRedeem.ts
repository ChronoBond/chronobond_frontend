"use client";

import { useEffect, useReducer, useCallback } from "react";
import * as fcl from "@onflow/fcl";
import { useFlowCurrentUser } from "@onflow/kit";
import { useToast } from "@/hooks/use-toast";
import {
  bondRedemptionService,
  type BondMaturityInfo,
} from "@/lib/bond-redemption-service";
import { swapService } from "@/lib/swap-service";
import {
  type RedeemHooksReturn,
  type ActiveTab,
  type ReinvestmentConfig,
} from "@/types/redeem.types";

export const useRedeem = (): RedeemHooksReturn => {
  const { user } = useFlowCurrentUser();
  const { toast } = useToast();

  type State = {
    activeTab: ActiveTab;
    // Bond states
    redeemableBonds: BondMaturityInfo[];
    pendingBonds: BondMaturityInfo[];
    nearingMaturity: BondMaturityInfo[];
    totalRedeemableValue: number;
    // UI states
    loading: boolean;
    error: string | null;
    success: string | null;
    redeeming: { [key: number]: boolean };
    // Reinvestment states
    scheduledBonds: { [bondID: number]: ReinvestmentConfig };
    loadingReinvestStatus: boolean;
    // Per-transaction loading states
    schedulingReinvestment: { [bondID: number]: boolean };
    cancelingReinvestment: { [bondID: number]: boolean };
    // Modal state
    redeemModalOpen: boolean;
    selectedBond: BondMaturityInfo | null;
    receiveToken: "FLOW" | "USDC";
    receiveQuote: string | null;
    quoteLoading: boolean;
  };

  const initialState: State = {
    activeTab: "redeemable",
    redeemableBonds: [],
    pendingBonds: [],
    nearingMaturity: [],
    totalRedeemableValue: 0,
    loading: false,
    error: null,
    success: null,
    redeeming: {},
    scheduledBonds: {},
    loadingReinvestStatus: false,
    schedulingReinvestment: {},
    cancelingReinvestment: {},
    redeemModalOpen: false,
    selectedBond: null,
    receiveToken: "FLOW",
    receiveQuote: null,
    quoteLoading: false,
  };

  type Action =
    | { type: "setActiveTab"; payload: ActiveTab }
    | {
        type: "setBonds";
        payload: Partial<
          Pick<
            State,
            | "redeemableBonds"
            | "pendingBonds"
            | "nearingMaturity"
            | "totalRedeemableValue"
          >
        >;
      }
    | { type: "setLoading"; payload: boolean }
    | { type: "setError"; payload: string | null }
    | { type: "setSuccess"; payload: string | null }
    | { type: "setRedeeming"; payload: { bondID: number; value: boolean } }
    | { type: "setRedeemModalOpen"; payload: boolean }
    | { type: "setSelectedBond"; payload: BondMaturityInfo | null }
    | { type: "setReceiveToken"; payload: "FLOW" | "USDC" }
    | { type: "setReceiveQuote"; payload: string | null }
    | { type: "setQuoteLoading"; payload: boolean }
    | {
        type: "setScheduledBonds";
        payload: { [bondID: number]: ReinvestmentConfig };
      }
    | { type: "setLoadingReinvestStatus"; payload: boolean }
    | {
        type: "setSchedulingReinvestment";
        payload: { bondID: number; value: boolean };
      }
    | {
        type: "setCancelingReinvestment";
        payload: { bondID: number; value: boolean };
      }
    | { type: "clearMessages" };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "setActiveTab":
        return { ...state, activeTab: action.payload };
      case "setBonds":
        return { ...state, ...action.payload };
      case "setLoading":
        return { ...state, loading: action.payload };
      case "setError":
        return { ...state, error: action.payload };
      case "setSuccess":
        return { ...state, success: action.payload };
      case "setRedeeming":
        return {
          ...state,
          redeeming: {
            ...state.redeeming,
            [action.payload.bondID]: action.payload.value,
          },
        };
      case "setRedeemModalOpen":
        return { ...state, redeemModalOpen: action.payload };
      case "setSelectedBond":
        return { ...state, selectedBond: action.payload };
      case "setReceiveToken":
        return { ...state, receiveToken: action.payload };
      case "setReceiveQuote":
        return { ...state, receiveQuote: action.payload };
      case "setQuoteLoading":
        return { ...state, quoteLoading: action.payload };
      case "setScheduledBonds":
        return { ...state, scheduledBonds: action.payload };
      case "setLoadingReinvestStatus":
        return { ...state, loadingReinvestStatus: action.payload };
      case "setSchedulingReinvestment":
        return {
          ...state,
          schedulingReinvestment: {
            ...state.schedulingReinvestment,
            [action.payload.bondID]: action.payload.value,
          },
        };
      case "setCancelingReinvestment":
        return {
          ...state,
          cancelingReinvestment: {
            ...state.cancelingReinvestment,
            [action.payload.bondID]: action.payload.value,
          },
        };
      case "clearMessages":
        return { ...state, error: null, success: null };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const loadBondData = useCallback(async () => {
    if (!user?.addr) return;

    try {
      dispatch({ type: "setLoading", payload: true });

      // Inline pending bond loader to keep dependencies minimal
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

      const pending =
        bondIDs && bondIDs.length > 0
          ? (
              await Promise.all(
                bondIDs.map((bondID: number) =>
                  bondRedemptionService.checkBondMaturity(
                    user?.addr || "",
                    bondID.toString()
                  )
                )
              )
            ).filter((b): b is BondMaturityInfo => !!b && !b.isMatured)
          : [];

      // Load all bond data in parallel
      const [redeemable, nearing, totalValue] = await Promise.all([
        bondRedemptionService.getRedeemableBonds(user.addr),
        bondRedemptionService.getBondsNearingMaturity(user.addr, 24),
        bondRedemptionService.getTotalRedeemableValue(user.addr),
      ]);

      dispatch({
        type: "setBonds",
        payload: {
          redeemableBonds: redeemable,
          pendingBonds: pending,
          nearingMaturity: nearing,
          totalRedeemableValue: totalValue,
        },
      });
    } catch (error) {
      dispatch({ type: "setError", payload: "Failed to load bond data" });
    } finally {
      dispatch({ type: "setLoading", payload: false });
    }
  }, [user?.addr]);

  useEffect(() => {
    if (!user?.loggedIn) return;
    loadBondData();
    const interval = setInterval(loadBondData, 30000);
    return () => clearInterval(interval);
  }, [user?.loggedIn, loadBondData]);

  // (pending bond loading is inlined into `loadBondData` to keep hook deps minimal)

  // Redeem a single matured bond
  const handleRedeemBond = async (bond: BondMaturityInfo) => {
    if (!bond.isMatured) {
      dispatch({
        type: "setError",
        payload: "Bond is not yet matured for redemption",
      });
      return;
    }
    dispatch({ type: "setSelectedBond", payload: bond });
    dispatch({ type: "setReceiveToken", payload: "FLOW" });
    dispatch({ type: "setReceiveQuote", payload: null });
    dispatch({ type: "setRedeemModalOpen", payload: true });
  };

  // Fetch quote when selected bond or receive token changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!state.selectedBond || state.receiveToken !== "USDC") {
        dispatch({ type: "setReceiveQuote", payload: null });
        return;
      }
      dispatch({ type: "setQuoteLoading", payload: true });
      const quote = await swapService.quoteOut({
        fromToken: "FLOW",
        toToken: "USDC",
        fromTokenAmount: state.selectedBond.expectedTotal.toString(),
      });
      dispatch({ type: "setQuoteLoading", payload: false });
      if (quote?.outputAmount) {
        dispatch({
          type: "setReceiveQuote",
          payload: `~${parseFloat(quote.outputAmount).toFixed(2)} USDC`,
        });
      } else {
        dispatch({ type: "setReceiveQuote", payload: null });
      }
    };
    fetchQuote();
  }, [state.selectedBond, state.receiveToken]);

  const confirmRedeem = async () => {
    if (!state.selectedBond) return;
    const bond = state.selectedBond;
    dispatch({
      type: "setRedeeming",
      payload: { bondID: bond.bondID, value: true },
    });
    dispatch({ type: "setError", payload: null });

    try {
      const result =
        state.receiveToken === "USDC"
          ? await bondRedemptionService.redeemAndSwap(
              bond.bondID.toString(),
              "USDC"
            )
          : await bondRedemptionService.redeemBond(bond.bondID.toString());

      if (result.success) {
        const message = `✅ Successfully redeemed Bond #${bond.bondID} for ${
          state.receiveToken === "USDC"
            ? state.receiveQuote || "USDC"
            : bondRedemptionService.formatCurrency(bond.expectedTotal)
        }!`;

        dispatch({
          type: "setSuccess",
          payload: message,
        });

        // Show success toast
        toast({
          title: "✅ Bond Redeemed",
          description: `Bond #${bond.bondID} redeemed for ${
            state.receiveToken === "USDC"
              ? state.receiveQuote || "USDC"
              : bondRedemptionService.formatCurrency(bond.expectedTotal)
          }`,
        });

        await loadBondData();
        dispatch({ type: "setRedeemModalOpen", payload: false });
        dispatch({ type: "setSelectedBond", payload: null });
        dispatch({ type: "setReceiveQuote", payload: null });
        dispatch({ type: "setReceiveToken", payload: "FLOW" });
        setTimeout(() => dispatch({ type: "setSuccess", payload: null }), 3000);
      } else {
        throw new Error(result.error || "Redemption failed");
      }
    } catch (error: unknown) {
      dispatch({
        type: "setError",
        payload:
          error instanceof Error
            ? `❌ Failed to redeem bond: ${error.message}`
            : "❌ Failed to redeem bond",
      });
    } finally {
      dispatch({
        type: "setRedeeming",
        payload: { bondID: bond.bondID, value: false },
      });
    }
  };

  // Redeem all matured bonds (sequentially to avoid multiple frames error)
  const handleRedeemAllBonds = async () => {
    if (state.redeemableBonds.length === 0) return;

    const confirmMessage =
      `Redeem all ${state.redeemableBonds.length} matured bonds?\n\n` +
      `Total value: ${bondRedemptionService.formatCurrency(
        state.totalRedeemableValue
      )}\n\nNote: Processing bonds one at a time may take a few minutes.`;

    if (!confirm(confirmMessage)) return;

    dispatch({ type: "setLoading", payload: true });
    dispatch({ type: "setError", payload: null });

    try {
      const results = [];

      // Process redemptions sequentially to avoid multiple frames error from FCL
      for (const bond of state.redeemableBonds) {
        try {
          const result = await bondRedemptionService.redeemBond(
            bond.bondID.toString()
          );
          results.push(result);

          // Show progress for each successful redemption
          if (result.success) {
            toast({
              title: "✅ Bond Redeemed",
              description: `Bond #${bond.bondID} redeemed (${
                results.filter((r) => r.success).length
              }/${state.redeemableBonds.length})`,
            });
          }
        } catch (err: unknown) {
          results.push({
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }

      const successful = results.filter((r) => r.success).length;
      const failed = results.length - successful;

      if (successful > 0) {
        const successMessage = `✅ Successfully redeemed ${successful} bonds for ${bondRedemptionService.formatCurrency(
          state.totalRedeemableValue
        )}!`;

        dispatch({
          type: "setSuccess",
          payload: successMessage,
        });

        // Show success toast
        toast({
          title: "✅ Bonds Redeemed",
          description: `Successfully redeemed ${successful}/${
            state.redeemableBonds.length
          } bonds for ${bondRedemptionService.formatCurrency(
            state.totalRedeemableValue
          )}`,
        });
      }

      if (failed > 0) {
        dispatch({
          type: "setError",
          payload: `❌ Failed to redeem ${failed} bonds`,
        });
      }

      await loadBondData(); // Refresh data
    } catch (error: unknown) {
      dispatch({
        type: "setError",
        payload:
          error instanceof Error
            ? `❌ Failed to redeem bonds: ${error.message}`
            : "❌ Failed to redeem bonds",
      });
    } finally {
      dispatch({ type: "setLoading", payload: false });
    }
  };

  const clearMessages = () => {
    dispatch({ type: "clearMessages" });
  };

  // Load reinvestment status
  const loadReinvestmentStatus = useCallback(async () => {
    if (!user?.addr) return;

    try {
      dispatch({ type: "setLoadingReinvestStatus", payload: true });
      const scheduledBonds =
        await bondRedemptionService.checkReinvestmentStatus(user.addr);
      dispatch({
        type: "setScheduledBonds",
        payload: scheduledBonds,
      });
    } catch (error) {
      console.error("Error loading reinvestment status:", error);
      // Don't show error to user, just silently fail
    } finally {
      dispatch({ type: "setLoadingReinvestStatus", payload: false });
    }
  }, [user?.addr]);

  // Schedule reinvestment for a bond
  const scheduleReinvestment = useCallback(
    async (
      bondID: number,
      duration: number,
      yieldRate: number,
      strategyID: string = "FlowStaking"
    ) => {
      if (!user?.addr) {
        dispatch({
          type: "setError",
          payload: "Please connect your wallet first",
        });
        return;
      }

      try {
        dispatch({ type: "setError", payload: null });
        dispatch({
          type: "setSchedulingReinvestment",
          payload: { bondID, value: true },
        });

        const result = await bondRedemptionService.scheduleReinvestment(
          bondID.toString(),
          duration,
          yieldRate,
          strategyID,
          user.addr
        );

        if (result.success) {
          toast({
            title: "✅ Auto-Reinvest Scheduled",
            description: `Bond #${bondID} will automatically reinvest on maturity`,
          });

          // Refresh reinvestment status
          await loadReinvestmentStatus();
        } else {
          throw new Error(result.error || "Failed to schedule reinvestment");
        }
      } catch (error: unknown) {
        dispatch({
          type: "setError",
          payload:
            error instanceof Error
              ? `❌ Failed to schedule: ${error.message}`
              : "❌ Failed to schedule reinvestment",
        });
      } finally {
        dispatch({
          type: "setSchedulingReinvestment",
          payload: { bondID, value: false },
        });
      }
    },
    [user?.addr, loadReinvestmentStatus]
  );

  // Cancel reinvestment for a bond
  const cancelReinvestment = useCallback(
    async (bondID: number) => {
      if (!user?.addr) {
        dispatch({
          type: "setError",
          payload: "Please connect your wallet first",
        });
        return;
      }

      try {
        dispatch({ type: "setError", payload: null });
        dispatch({
          type: "setCancelingReinvestment",
          payload: { bondID, value: true },
        });

        const result = await bondRedemptionService.cancelReinvestment(
          bondID.toString()
        );

        if (result.success) {
          toast({
            title: "✅ Auto-Reinvest Cancelled",
            description: `Bond #${bondID} will no longer auto-reinvest`,
          });

          // Refresh reinvestment status
          await loadReinvestmentStatus();
        } else {
          throw new Error(result.error || "Failed to cancel reinvestment");
        }
      } catch (error: unknown) {
        dispatch({
          type: "setError",
          payload:
            error instanceof Error
              ? `❌ Failed to cancel: ${error.message}`
              : "❌ Failed to cancel reinvestment",
        });
      } finally {
        dispatch({
          type: "setCancelingReinvestment",
          payload: { bondID, value: false },
        });
      }
    },
    [user?.addr, loadReinvestmentStatus]
  );

  // Load reinvestment status on mount/when user changes
  useEffect(() => {
    if (!user?.loggedIn) return;
    loadReinvestmentStatus();
  }, [user?.loggedIn, loadReinvestmentStatus]);

  return {
    // State
    activeTab: state.activeTab,
    redeemableBonds: state.redeemableBonds,
    pendingBonds: state.pendingBonds,
    nearingMaturity: state.nearingMaturity,
    totalRedeemableValue: state.totalRedeemableValue,
    loading: state.loading,
    error: state.error,
    success: state.success,
    redeeming: state.redeeming,
    // Reinvestment state
    scheduledBonds: state.scheduledBonds,
    loadingReinvestStatus: state.loadingReinvestStatus,
    schedulingReinvestment: state.schedulingReinvestment,
    cancelingReinvestment: state.cancelingReinvestment,
    // Modal state
    redeemModalOpen: state.redeemModalOpen,
    selectedBond: state.selectedBond,
    receiveToken: state.receiveToken,
    receiveQuote: state.receiveQuote,
    quoteLoading: state.quoteLoading,

    // Actions
    setActiveTab: (t: ActiveTab) =>
      dispatch({ type: "setActiveTab", payload: t }),
    loadBondData,
    handleRedeemBond,
    handleRedeemAllBonds,
    clearMessages,
    // Reinvestment actions
    loadReinvestmentStatus,
    scheduleReinvestment,
    cancelReinvestment,
    setRedeemModalOpen: (open: boolean) =>
      dispatch({ type: "setRedeemModalOpen", payload: open }),
    setReceiveToken: (t: "FLOW" | "USDC") =>
      dispatch({ type: "setReceiveToken", payload: t }),
    confirmRedeem,
  };
};
