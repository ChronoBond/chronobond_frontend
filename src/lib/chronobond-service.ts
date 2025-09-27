import * as fcl from "@onflow/fcl";
import { TRANSACTIONS, SCRIPTS } from "./flow-config";
import { formatForUFix64 } from "./utils";

export interface BondData {
  id: number;
  principal: number;
  maturityDate: number;
  yieldRate: number;
  strategyID: string;
}

export interface BondDetails {
  bondID: number;
  principal: number;
  yieldRate: number;
  strategyID: string;
  maturityDate: number;
  currentTime: number;
  isMatured: boolean;
  timeUntilMaturity: number;
  expectedYield: number;
  expectedTotal: number;
}

export interface MarketplaceListing {
  bondID: number;
  seller: string;
  price: number;
  principal: number;
  maturityDate: number;
  yieldRate: number;
  strategyID: string;
  isAvailable?: boolean;
}

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export class ChronoBondService {
  
  /**
   * Check if user account has ChronoBond collection set up
   */
  async checkAccountSetup(address: string): Promise<boolean> {
    try {
      const result = await fcl.query({
        cadence: SCRIPTS.CHECK_ACCOUNT_SETUP,
        args: (arg: any, t: any) => [arg(address, t.Address)]
      });
      return result;
    } catch (error) {
      /* console.error("Error checking account setup:", error); */
      return false;
    }
  }

  /**
   * Setup ChronoBond collection for the user account
   */
  async setupAccount(): Promise<TransactionResult> {
    try {
      const transactionId = await fcl.mutate({
        cadence: TRANSACTIONS.SETUP_ACCOUNT,
        args: (_arg: any, _t: any) => [],
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        payer: fcl.authz,
        limit: 9999
      });

      await fcl.tx(transactionId).onceSealed();
      return { success: true, transactionId };
    } catch (error: any) {
      /* console.error("Error setting up account:", error); */
      return { success: false, error: error.message || "Failed to setup account" };
    }
  }

  /**
   * Mint a new bond
   */
  async mintBond(
    strategyID: string, 
    amount: string, 
    lockupPeriod: string
  ): Promise<TransactionResult> {
    try {
      const transactionId = await fcl.mutate({
        cadence: TRANSACTIONS.MINT_BOND,
        args: (arg: any, t: any) => [
          arg(strategyID, t.String),
          arg(formatForUFix64(amount), t.UFix64),
          arg(lockupPeriod, t.UInt64)
        ],
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        payer: fcl.authz,
        limit: 9999
      });

      await fcl.tx(transactionId).onceSealed();
      return { success: true, transactionId };
    } catch (error: any) {
      /* console.error("Error minting bond:", error); */
      return { success: false, error: error.message || "Failed to mint bond" };
    }
  }

  /**
   * Get all bonds for a user
   */
  async getUserBonds(address: string): Promise<BondData[]> {
    try {
      const result = await fcl.query({
        cadence: SCRIPTS.GET_USER_BONDS,
        args: (arg: any, t: any) => [arg(address, t.Address)]
      });
      return result || [];
    } catch (error) {
      /* console.error("Error getting user bonds:", error); */
      return [];
    }
  }

  /**
   * Get detailed bond information including maturity status
   */
  async getBondDetails(address: string, bondID: string): Promise<BondDetails | null> {
    try {
      const result = await fcl.query({
        cadence: SCRIPTS.CHECK_BOND_MATURITY,
        args: (arg: any, t: any) => [
          arg(address, t.Address),
          arg(bondID, t.UInt64)
        ]
      });
      return result;
    } catch (error) {
      /* console.error("Error getting bond details:", error); */
      return null;
    }
  }

  /**
   * Check if user has marketplace setup
   */
  async checkMarketplaceSetup(address: string): Promise<boolean> {
    try {
      const script = `
        import Marketplace from 0xMarketplace

        access(all) fun main(address: Address): Bool {
          let account = getAccount(address)
          let cap = account.capabilities.get<&{Marketplace.SaleCollectionPublic}>(/public/ChronoBondSaleCollection)
          return cap.check()
        }
      `;

      const result = await fcl.query({
        cadence: script,
        args: (arg: any, t: any) => [arg(address, t.Address)]
      });
      return result;
    } catch (error) {
      /* console.error("Error checking marketplace setup:", error); */
      return false;
    }
  }

  /**
   * Utility function to format time until maturity
   */
  formatTimeUntilMaturity(seconds: number): string {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  /**
   * Utility function to format timestamp
   */
  formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
  }

  /**
   * Utility function to format FLOW amounts
   */
  formatFlowAmount(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) {
      return "0.0000 FLOW";
    }
    return `${numAmount.toFixed(4)} FLOW`;
  }

  /**
   * Utility function to calculate expected yield
   */
  calculateExpectedYield(principal: number, yieldRate: number, durationMultiplier: number = 1): number {
    return principal * yieldRate * durationMultiplier;
  }

  /**
   * Utility function to calculate total return
   */
  calculateTotalReturn(principal: number, yieldRate: number, durationMultiplier: number = 1): number {
    return principal + this.calculateExpectedYield(principal, yieldRate, durationMultiplier);
  }
}

// Export singleton instance
export const chronoBondService = new ChronoBondService(); 