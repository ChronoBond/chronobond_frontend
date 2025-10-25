"use client";

import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { useFlowCurrentUser } from "@onflow/kit";
import { bondRedemptionService, type BondMaturityInfo } from "@/lib/bond-redemption-service";
import { type RedeemHooksReturn, type ActiveTab } from "@/types/redeem.types";

export const useRedeem = (): RedeemHooksReturn => {
  const { user } = useFlowCurrentUser();
  
  const [activeTab, setActiveTab] = useState<ActiveTab>("redeemable");
  
  // Bond states
  const [redeemableBonds, setRedeemableBonds] = useState<BondMaturityInfo[]>([]);
  const [pendingBonds, setPendingBonds] = useState<BondMaturityInfo[]>([]);
  const [nearingMaturity, setNearingMaturity] = useState<BondMaturityInfo[]>([]);
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
      return [];
    }
  };

  // 🔍 LOAD BOND DATA FROM BLOCKCHAIN
  const loadBondData = async () => {
    if (!user?.addr) return;

    try {
      setLoading(true);

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
    } catch (error) {
      setError("Failed to load bond data");
    } finally {
      setLoading(false);
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
      const result = await bondRedemptionService.redeemBond(
        bond.bondID.toString()
      );

      if (result.success) {
        setSuccess(
          `✅ Successfully redeemed Bond #${
            bond.bondID
          } for ${bondRedemptionService.formatCurrency(bond.expectedTotal)}!`
        );
        await loadBondData(); // Refresh data

        // Auto-clear success after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        throw new Error(result.error || "Redemption failed");
      }
    } catch (error: unknown) {
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

  return {
    // State
    activeTab,
    redeemableBonds,
    pendingBonds,
    nearingMaturity,
    totalRedeemableValue,
    loading,
    error,
    success,
    redeeming,
    
    // Actions
    setActiveTab,
    loadBondData,
    handleRedeemBond,
    handleRedeemAllBonds,
    clearMessages
  };
};
