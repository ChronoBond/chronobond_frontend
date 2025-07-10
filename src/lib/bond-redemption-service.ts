// src/lib/bond-redemption-service.ts
import * as fcl from "@onflow/fcl";

export interface BondMaturityInfo {
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

export interface RedemptionResult {
  success: boolean;
  transactionId?: string;
  totalRedeemed?: number;
  error?: string;
}

export class BondRedemptionService {

  // ✅ 1. CHECK BOND MATURITY - Real Blockchain Query
  async checkBondMaturity(userAddress: string, bondID: string): Promise<BondMaturityInfo | null> {
    const script = `
      import NonFungibleToken from 0xNonFungibleToken
      import ChronoBond from 0xChronoBond

      access(all) fun main(address: Address, bondID: UInt64): {String: AnyStruct} {
        let account = getAccount(address)
        
        let collectionRef = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(ChronoBond.CollectionPublicPath)
          .borrow() ?? panic("Could not borrow collection reference")
        
        let nft = collectionRef.borrowNFT(bondID) ?? panic("Could not borrow NFT reference")
        let bond = nft as! &ChronoBond.NFT
        
        let currentTime = getCurrentBlock().timestamp
        let isMatured = currentTime >= bond.maturityDate
        let timeUntilMaturity = isMatured ? 0.0 : bond.maturityDate - currentTime
        
        // Calculate expected total return
        let expectedYield = bond.principal * bond.yieldRate
        let expectedTotal = bond.principal + expectedYield
        
        return {
          "bondID": bond.id,
          "principal": bond.principal,
          "yieldRate": bond.yieldRate,
          "strategyID": bond.strategyID,
          "maturityDate": bond.maturityDate,
          "currentTime": currentTime,
          "isMatured": isMatured,
          "timeUntilMaturity": timeUntilMaturity,
          "expectedYield": expectedYield,
          "expectedTotal": expectedTotal
        }
      }
    `;

    try {
      console.log(`🔍 Checking maturity for bond ${bondID}...`);
      const result = await fcl.query({
        cadence: script,
        args: (arg: any, t: any) => [
          arg(userAddress, t.Address),
          arg(bondID, t.UInt64)
        ]
      });
      
      console.log(`📊 Bond ${bondID} maturity info:`, result);
      
      // Check if result is valid
      if (!result || typeof result !== 'object') {
        console.error(`Invalid result for bond ${bondID}:`, result);
        return null;
      }
      
      // Ensure numeric values are properly converted
      const bondInfo: BondMaturityInfo = {
        bondID: parseInt(result.bondID?.toString() || '0'),
        principal: parseFloat(result.principal?.toString() || '0'),
        yieldRate: parseFloat(result.yieldRate?.toString() || '0'),
        strategyID: result.strategyID?.toString() || 'Unknown',
        maturityDate: parseFloat(result.maturityDate?.toString() || '0'),
        currentTime: parseFloat(result.currentTime?.toString() || '0'),
        isMatured: Boolean(result.isMatured),
        timeUntilMaturity: parseFloat(result.timeUntilMaturity?.toString() || '0'),
        expectedYield: parseFloat(result.expectedYield?.toString() || '0'),
        expectedTotal: parseFloat(result.expectedTotal?.toString() || '0')
      };
      
      // Validate that we got reasonable values
      if (bondInfo.bondID === 0 || bondInfo.principal === 0) {
        console.error(`Invalid bond data for bond ${bondID}:`, bondInfo);
        return null;
      }
      
      return bondInfo;
    } catch (error) {
      console.error("Error checking bond maturity:", error);
      return null;
    }
  }

  // ✅ 2. REDEEM BOND - Real Transaction
  async redeemBond(bondID: string): Promise<RedemptionResult> {
    const transaction = `
      import FungibleToken from 0xFungibleToken
      import NonFungibleToken from 0xNonFungibleToken
      import ChronoBond from 0xChronoBond
      import FlowStakingStrategy from 0xFlowStakingStrategy

      transaction(bondID: UInt64) {
        let bond: @{NonFungibleToken.NFT}
        let signer: auth(Storage, Capabilities) &Account

        prepare(signer: auth(Storage, Capabilities) &Account) {
          self.signer = signer
          
          // Get an authorized reference to the collection
          let collection = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &ChronoBond.Collection>(from: ChronoBond.CollectionStoragePath)
            ?? panic("Could not borrow collection resource")
          
          // First, borrow the NFT to check its properties
          let nftRef = collection.borrowNFT(bondID) ?? panic("Could not borrow NFT reference")
          let chronoBond = nftRef as! &ChronoBond.NFT
          
          // Check if the bond has matured
          if getCurrentBlock().timestamp < chronoBond.maturityDate {
            panic("Bond has not yet matured. Maturity date: ".concat(chronoBond.maturityDate.toString()))
          }
          
          // Now withdraw the NFT
          self.bond <- collection.withdraw(withdrawID: bondID)
        }

        execute {
          // Cast the bond to ChronoBond.NFT for redemption
          let chronoBond <- self.bond as! @ChronoBond.NFT
          
          // Use ChronoBond's direct redemption function
          let totalReturn = ChronoBond.redeemBond(bond: <-chronoBond)
          
          // Log the redemption details
          log("✅ Redeemed bond with total value: ".concat(totalReturn.toString()))
          log("💰 This includes principal + yield calculated at 8% APY")
        }
      }
    `;

    try {
      console.log(`💰 Redeeming bond ${bondID}...`);
      
      const transactionId = await fcl.mutate({
        cadence: transaction,
        args: (arg: any, t: any) => [arg(bondID, t.UInt64)],
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        payer: fcl.authz,
        limit: 9999
      });

      const result = await fcl.tx(transactionId).onceSealed();
      
      if (result.status === 4) {
        console.log("✅ Bond redeemed successfully:", result);
        return {
          success: true,
          transactionId: transactionId
        };
      } else {
        throw new Error(`Transaction failed: ${result.errorMessage}`);
      }
    } catch (error: any) {
      console.error("❌ Error redeeming bond:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ✅ 3. GET REDEEMABLE BONDS - Filter matured bonds
  async getRedeemableBonds(userAddress: string): Promise<BondMaturityInfo[]> {
    try {
      // First get all user bonds
      const bondsScript = `
        import NonFungibleToken from 0xNonFungibleToken
        import ChronoBond from 0xChronoBond

        access(all) fun main(address: Address): [UInt64] {
          let account = getAccount(address)
          
          let collectionRef = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(ChronoBond.CollectionPublicPath)
            .borrow()
          
          if collectionRef == nil {
            return []
          }
          
          return collectionRef!.getIDs()
        }
      `;

      console.log("🔍 Getting user bonds for redemption check...");
      const bondIDs = await fcl.query({
        cadence: bondsScript,
        args: (arg: any, t: any) => [arg(userAddress, t.Address)]
      });

      if (!bondIDs || bondIDs.length === 0) {
        console.log("📊 No bonds found for user");
        return [];
      }

      // Check maturity for each bond
      const maturityPromises = bondIDs.map((bondID: number) => 
        this.checkBondMaturity(userAddress, bondID.toString())
      );

      const maturityResults = await Promise.all(maturityPromises);
      
      // Filter only matured bonds
      const redeemableBonds = maturityResults
        .filter((bond): bond is BondMaturityInfo => bond !== null && bond.isMatured);

      console.log(`📊 Found ${redeemableBonds.length} redeemable bonds out of ${bondIDs.length} total`);
      return redeemableBonds;
    } catch (error) {
      console.error("Error getting redeemable bonds:", error);
      return [];
    }
  }

  // ✅ 4. GET BONDS NEARING MATURITY - For dashboard notifications
  async getBondsNearingMaturity(userAddress: string, hoursThreshold: number = 24): Promise<BondMaturityInfo[]> {
    try {
      const bondsScript = `
        import NonFungibleToken from 0xNonFungibleToken
        import ChronoBond from 0xChronoBond

        access(all) fun main(address: Address): [UInt64] {
          let account = getAccount(address)
          
          let collectionRef = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(ChronoBond.CollectionPublicPath)
            .borrow()
          
          if collectionRef == nil {
            return []
          }
          
          return collectionRef!.getIDs()
        }
      `;

      const bondIDs = await fcl.query({
        cadence: bondsScript,
        args: (arg: any, t: any) => [arg(userAddress, t.Address)]
      });

      if (!bondIDs || bondIDs.length === 0) {
        return [];
      }

      const maturityPromises = bondIDs.map((bondID: number) => 
        this.checkBondMaturity(userAddress, bondID.toString())
      );

      const maturityResults = await Promise.all(maturityPromises);
      
      // Filter bonds nearing maturity (within threshold)
      const thresholdSeconds = hoursThreshold * 60 * 60;
      const nearingMaturity = maturityResults
        .filter((bond): bond is BondMaturityInfo => 
          bond !== null && 
          !bond.isMatured && 
          bond.timeUntilMaturity <= thresholdSeconds
        );

      return nearingMaturity;
    } catch (error) {
      console.error("Error getting bonds nearing maturity:", error);
      return [];
    }
  }

  // ✅ 5. CALCULATE TOTAL REDEEMABLE VALUE
  async getTotalRedeemableValue(userAddress: string): Promise<number> {
    try {
      const redeemableBonds = await this.getRedeemableBonds(userAddress);
      const totalValue = redeemableBonds.reduce((sum, bond) => sum + bond.expectedTotal, 0);
      
      console.log(`💰 Total redeemable value: ${totalValue} FLOW`);
      return totalValue;
    } catch (error) {
      console.error("Error calculating total redeemable value:", error);
      return 0;
    }
  }

  // ✅ 6. UTILITY FUNCTIONS
  formatTimeRemaining(seconds: number): string {
    if (seconds <= 0) return "Matured";
    
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '0.00 FLOW';
    return `${numAmount.toFixed(2)} FLOW`;
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }
}

export const bondRedemptionService = new BondRedemptionService(); 