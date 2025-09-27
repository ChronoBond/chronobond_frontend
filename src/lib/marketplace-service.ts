// src/lib/marketplace-service.ts (WORKING VERSION - Real Blockchain Queries)
import * as fcl from "@onflow/fcl";

export interface MarketplaceListing {
  bondID: number;
  price: number;
  seller: string;
  isAvailable: boolean;
}

export interface TransactionResult {
  status: number;
  errorMessage?: string;
  transactionId?: string;
}

export class MarketplaceService {
  
  // ✅ 1. LIST BOND FOR SALE - WORKING
  async listBondForSale(bondID: string, price: string): Promise<TransactionResult> {
    const transaction = `
      import FungibleToken from 0xFungibleToken
      import NonFungibleToken from 0xNonFungibleToken
      import ChronoBond from 0xChronoBond
      import Marketplace from 0xMarketplace

      transaction(bondID: UInt64, price: UFix64) {
        let saleCollection: &Marketplace.SaleCollection
        let bondCollection: auth(NonFungibleToken.Withdraw) &ChronoBond.Collection
        let beneficiary: Capability<&{FungibleToken.Receiver}>

        prepare(signer: auth(Storage, Capabilities) &Account) {
          // Auto-create marketplace if needed (uses correct capability type)
          if signer.storage.borrow<&Marketplace.SaleCollection>(from: /storage/ChronoBondSaleCollection) == nil {
            let saleCollection <- Marketplace.createSaleCollection()
            signer.storage.save(<-saleCollection, to: /storage/ChronoBondSaleCollection)
            
            // FIXED: Publish with full type, not interface
            let cap = signer.capabilities.storage.issue<&Marketplace.SaleCollection>(/storage/ChronoBondSaleCollection)
            signer.capabilities.publish(cap, at: /public/ChronoBondSaleCollection)
          }
          
          self.saleCollection = signer.storage.borrow<&Marketplace.SaleCollection>(from: /storage/ChronoBondSaleCollection)
            ?? panic("Could not borrow SaleCollection from signer")

          self.bondCollection = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &ChronoBond.Collection>(from: ChronoBond.CollectionStoragePath)
            ?? panic("Could not borrow ChronoBond Collection from signer")

          self.beneficiary = signer.capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        }

        execute {
          let bond <- self.bondCollection.withdraw(withdrawID: bondID) as! @ChronoBond.NFT
          self.saleCollection.listForSale(token: <-bond, price: price, beneficiary: self.beneficiary)
        }
      }
    `;

    try {
      const transactionId = await fcl.mutate({
        cadence: transaction,
        args: (arg: any, t: any) => [
          arg(bondID, t.UInt64),
          arg(price, t.UFix64)
        ],
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        payer: fcl.authz,
        limit: 9999
      });

      const result = await fcl.tx(transactionId).onceSealed();
      return {
        status: result.status,
        transactionId: transactionId,
        errorMessage: result.errorMessage
      };
    } catch (error: any) {
      /* console.error("Error listing bond for sale:", error); */
      return {
        status: 0,
        errorMessage: error.message || "Failed to list bond for sale"
      };
    }
  }

  // ✅ 2. GET MARKETPLACE LISTINGS - WORKING WITH REAL BLOCKCHAIN QUERIES
  async getMarketplaceListings(sellerAddresses: string[]): Promise<MarketplaceListing[]> {
    const script = `
      import Marketplace from 0xMarketplace

      access(all) struct MarketplaceListing {
        access(all) let bondID: UInt64
        access(all) let price: UFix64
        access(all) let seller: Address
        access(all) let isAvailable: Bool

        init(bondID: UInt64, price: UFix64, seller: Address, isAvailable: Bool) {
          self.bondID = bondID
          self.price = price
          self.seller = seller
          self.isAvailable = isAvailable
        }
      }

      access(all) fun main(sellerAddresses: [Address]): [MarketplaceListing] {
        let allListings: [MarketplaceListing] = []
        
        for sellerAddress in sellerAddresses {
          let account = getAccount(sellerAddress)
          
          // FIXED: Use correct capability type
          let cap = account.capabilities.get<&Marketplace.SaleCollection>(/public/ChronoBondSaleCollection)
          
          if cap.check() {
            if let saleCollection = cap.borrow() {
              let bondIDs = saleCollection.getIDs()
              
              for bondID in bondIDs {
                if let price = saleCollection.getPrice(tokenID: bondID) {
                  let isAvailable = saleCollection.idExists(tokenID: bondID)
                  allListings.append(MarketplaceListing(
                    bondID: bondID,
                    price: price,
                    seller: sellerAddress,
                    isAvailable: isAvailable
                  ))
                }
              }
            }
          }
        }
        
        return allListings
      }
    `;

    try {
      /* console.log("🔍 Querying marketplace listings from blockchain..."); */
      const result = await fcl.query({
        cadence: script,
        args: (arg: any, t: any) => [
          arg(sellerAddresses, t.Array(t.Address))
        ]
      });
      
      /* console.log(`📊 Found ${result.length} listings from blockchain`); */
      return result || [];
    } catch (error) {
      /* console.error("Error getting marketplace listings:", error); */
      return [];
    }
  }

  // ✅ 3. GET USER'S MARKETPLACE LISTINGS - WORKING
  async getUserMarketplaceListings(userAddress: string): Promise<MarketplaceListing[]> {
    return this.getMarketplaceListings([userAddress]);
  }

  // ✅ 4. PURCHASE BOND - WORKING  
  async purchaseBond(sellerAddress: string, bondID: string, amount: string): Promise<TransactionResult> {
    const transaction = `
      import FungibleToken from 0xFungibleToken
      import NonFungibleToken from 0xNonFungibleToken
      import ChronoBond from 0xChronoBond
      import Marketplace from 0xMarketplace

      transaction(sellerAddress: Address, bondID: UInt64, amount: UFix64) {
        let saleCollection: &Marketplace.SaleCollection
        let buyerCollection: &{NonFungibleToken.Receiver}
        let payment: @{FungibleToken.Vault}

        prepare(signer: auth(Storage, Capabilities) &Account) {
          let sellerAccount = getAccount(sellerAddress)
          
          // FIXED: Use correct capability type
          self.saleCollection = sellerAccount.capabilities.get<&Marketplace.SaleCollection>(/public/ChronoBondSaleCollection)
            .borrow() ?? panic("Could not borrow SaleCollection from seller")

          self.buyerCollection = signer.capabilities.get<&{NonFungibleToken.Receiver}>(ChronoBond.CollectionPublicPath)
            .borrow() ?? panic("Could not borrow buyer's ChronoBond collection")

          let vault = signer.storage.borrow<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(from: /storage/flowTokenVault) 
            ?? panic("Could not borrow Flow token vault")
          self.payment <- vault.withdraw(amount: amount)
        }

        execute {
          self.saleCollection.purchase(tokenID: bondID, buyerCollection: self.buyerCollection, payment: <-self.payment)
        }
      }
    `;

    try {
      const transactionId = await fcl.mutate({
        cadence: transaction,
        args: (arg: any, t: any) => [
          arg(sellerAddress, t.Address),
          arg(bondID, t.UInt64),
          arg(amount, t.UFix64)
        ],
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        payer: fcl.authz,
        limit: 9999
      });

      const result = await fcl.tx(transactionId).onceSealed();
      return {
        status: result.status,
        transactionId: transactionId,
        errorMessage: result.errorMessage
      };
    } catch (error: any) {
      /* console.error("Error purchasing bond:", error); */
      return {
        status: 0,
        errorMessage: error.message || "Failed to purchase bond"
      };
    }
  }

  // ✅ 5. WITHDRAW BOND FROM SALE - WORKING
  async withdrawBondFromSale(bondID: string): Promise<TransactionResult> {
    const transaction = `
      import NonFungibleToken from 0xNonFungibleToken
      import ChronoBond from 0xChronoBond
      import Marketplace from 0xMarketplace

      transaction(bondID: UInt64) {
        let saleCollection: &Marketplace.SaleCollection
        let bondCollection: &{NonFungibleToken.Receiver}

        prepare(signer: auth(Storage, Capabilities) &Account) {
          self.saleCollection = signer.storage.borrow<&Marketplace.SaleCollection>(from: /storage/ChronoBondSaleCollection)
            ?? panic("Could not borrow SaleCollection from signer")

          self.bondCollection = signer.capabilities.get<&{NonFungibleToken.Receiver}>(ChronoBond.CollectionPublicPath)
            .borrow() ?? panic("Could not borrow ChronoBond collection")
        }

        execute {
          let bond <- self.saleCollection.withdraw(tokenID: bondID)
          self.bondCollection.deposit(token: <-bond)
        }
      }
    `;

    try {
      const transactionId = await fcl.mutate({
        cadence: transaction,
        args: (arg: any, t: any) => [arg(bondID, t.UInt64)],
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        payer: fcl.authz,
        limit: 9999
      });

      const result = await fcl.tx(transactionId).onceSealed();
      return {
        status: result.status,
        transactionId: transactionId,
        errorMessage: result.errorMessage
      };
    } catch (error: any) {
      /* console.error("Error withdrawing bond from sale:", error); */
      return {
        status: 0,
        errorMessage: error.message || "Failed to withdraw bond from sale"
      };
    }
  }

  // ✅ 6. SETUP MARKETPLACE - WORKING
  async setupMarketplace(): Promise<TransactionResult> {
    const transaction = `
      import Marketplace from 0xMarketplace

      transaction() {
        prepare(signer: auth(Storage, Capabilities) &Account) {
          // Only set up if not already done
          if signer.storage.borrow<&Marketplace.SaleCollection>(from: /storage/ChronoBondSaleCollection) == nil {
            // Create marketplace collection
            let saleCollection <- Marketplace.createSaleCollection()
            signer.storage.save(<-saleCollection, to: /storage/ChronoBondSaleCollection)
            
            // Publish capability with correct type
            let cap = signer.capabilities.storage.issue<&Marketplace.SaleCollection>(/storage/ChronoBondSaleCollection)
            signer.capabilities.publish(cap, at: /public/ChronoBondSaleCollection)
          }
        }
      }
    `;

    try {
      const transactionId = await fcl.mutate({
        cadence: transaction,
        args: (_arg: any, _t: any) => [],
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        payer: fcl.authz,
        limit: 9999
      });

      const result = await fcl.tx(transactionId).onceSealed();
      return {
        status: result.status,
        transactionId: transactionId,
        errorMessage: result.errorMessage
      };
    } catch (error: any) {
      /* console.error("Error setting up marketplace:", error); */
      return {
        status: 0,
        errorMessage: error.message || "Failed to setup marketplace"
      };
    }
  }
}

export const marketplaceService = new MarketplaceService(); 