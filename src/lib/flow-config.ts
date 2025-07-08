import * as fcl from "@onflow/fcl";

export const initializeFlowTestnet = () => {
  fcl.config({
    "accessNode.api": "https://rest-testnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
    "app.detail.title": "ChronoBond",
    "app.detail.icon": "https://your-app-icon.com/icon.png",
    
    // Standard contracts on testnet
    "0xNonFungibleToken": "0x631e88ae7f1d7c20",
    "0xFungibleToken": "0x9a0766d93b6608b7",
    "0xFlowToken": "0x7e60df042a9c0868", 
    "0xViewResolver": "0x631e88ae7f1d7c20",
    "0xMetadataViews": "0x631e88ae7f1d7c20",
    "0xFungibleTokenMetadataViews": "0x9a0766d93b6608b7",
    "0xBurner": "0x9a0766d93b6608b7",
    
    // Your custom contracts
    "0xChronoBond": "0x45722594009505d7",
    "0xMarketplace": "0x45722594009505d7",
    "0xIYieldStrategy": "0x45722594009505d7",
    "0xFlowStakingStrategy": "0x45722594009505d7",
  });
};

// Transaction codes with proper testnet addresses
export const TRANSACTIONS = {
  SETUP_ACCOUNT: `
    import NonFungibleToken from 0xNonFungibleToken
    import ChronoBond from 0xChronoBond

    transaction {
      prepare(signer: auth(Storage, Capabilities) &Account) {
        if signer.storage.borrow<&ChronoBond.Collection>(from: ChronoBond.CollectionStoragePath) == nil {
          signer.storage.save(<-ChronoBond.createEmptyCollection(nftType: Type<@ChronoBond.NFT>()), to: ChronoBond.CollectionStoragePath)

          let collectionCap = signer.capabilities.storage.issue<&ChronoBond.Collection>(ChronoBond.CollectionStoragePath)
          signer.capabilities.publish(collectionCap, at: ChronoBond.CollectionPublicPath)
        }
      }
    }
  `,
  
  MINT_BOND: `
    import FungibleToken from 0xFungibleToken
    import NonFungibleToken from 0xNonFungibleToken
    import ChronoBond from 0xChronoBond
    import FlowStakingStrategy from 0xFlowStakingStrategy

    transaction(strategyID: String, amount: UFix64, lockupPeriod: UInt64) {
      let receiver: &{NonFungibleToken.CollectionPublic}
      let vault: @{FungibleToken.Vault}

      prepare(signer: auth(Storage, Capabilities) &Account) {
        self.receiver = signer.capabilities.get<&{NonFungibleToken.CollectionPublic}>(ChronoBond.CollectionPublicPath)
          .borrow() ?? panic("Could not borrow receiver capability")

        self.vault <- FlowStakingStrategy.createMockVault(amount: amount)
      }

      execute {
        let currentTime = getCurrentBlock().timestamp
        let maturityTime = currentTime + UFix64(lockupPeriod)
        
        ChronoBond.mintNFT(
          recipient: self.receiver,
          principal: amount,
          maturityDate: maturityTime,
          yieldRate: 0.08,
          strategyID: strategyID
        )
        
        destroy self.vault
      }
    }
  `,
  
  LIST_BOND: `
    import FungibleToken from 0xFungibleToken
    import NonFungibleToken from 0xNonFungibleToken
    import ChronoBond from 0xChronoBond
    import Marketplace from 0xMarketplace

    transaction(bondID: UInt64, price: UFix64) {
      let saleCollection: &Marketplace.SaleCollection
      let bondCollection: auth(NonFungibleToken.Withdraw) &ChronoBond.Collection
      let beneficiary: Capability<&{FungibleToken.Receiver}>

      prepare(signer: auth(Storage, Capabilities) &Account) {
        if signer.storage.borrow<&Marketplace.SaleCollection>(from: /storage/ChronoBondSaleCollection) == nil {
          let saleCollection <- Marketplace.createSaleCollection()
          signer.storage.save(<-saleCollection, to: /storage/ChronoBondSaleCollection)
          
          let cap = signer.capabilities.storage.issue<&{Marketplace.SaleCollectionPublic}>(/storage/ChronoBondSaleCollection)
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
  `,

  PURCHASE_BOND: `
    import FungibleToken from 0xFungibleToken
    import NonFungibleToken from 0xNonFungibleToken
    import ChronoBond from 0xChronoBond
    import Marketplace from 0xMarketplace
    import FlowToken from 0xFlowToken

    transaction(sellerAddress: Address, bondID: UInt64, amount: UFix64) {
      let paymentVault: @{FungibleToken.Vault}
      let collection: &{NonFungibleToken.CollectionPublic}
      let saleCollection: &{Marketplace.SaleCollectionPublic}

      prepare(signer: auth(Storage, Capabilities) &Account) {
        self.paymentVault <- signer.storage.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!
          .withdraw(amount: amount)

        self.collection = signer.capabilities.get<&{NonFungibleToken.CollectionPublic}>(ChronoBond.CollectionPublicPath)
          .borrow() ?? panic("Could not borrow buyer's collection")

        let sellerAccount = getAccount(sellerAddress)
        self.saleCollection = sellerAccount.capabilities.get<&{Marketplace.SaleCollectionPublic}>(/public/ChronoBondSaleCollection)
          .borrow() ?? panic("Could not borrow seller's sale collection")
      }

      execute {
        self.saleCollection.purchase(tokenID: bondID, buyerCollection: self.collection, buyerPayment: <-self.paymentVault)
      }
    }
  `
};

// Query scripts with proper testnet addresses
export const SCRIPTS = {
  CHECK_ACCOUNT_SETUP: `
    import NonFungibleToken from 0xNonFungibleToken
    import ChronoBond from 0xChronoBond

    access(all) fun main(address: Address): Bool {
      let account = getAccount(address)
      let collectionRef = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(ChronoBond.CollectionPublicPath)
      return collectionRef.check()
    }
  `,
  
  GET_USER_BONDS: `
    import NonFungibleToken from 0xNonFungibleToken
    import ChronoBond from 0xChronoBond

    access(all) fun main(address: Address): [{String: AnyStruct}] {
      let account = getAccount(address)
      
      let collectionRef = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(ChronoBond.CollectionPublicPath)
        .borrow()
      
      // Return empty array if no collection
      if collectionRef == nil {
        return []
      }
      
      let ids = collectionRef!.getIDs()
      let bonds: [{String: AnyStruct}] = []
      
      for id in ids {
        let nft = collectionRef!.borrowNFT(id) ?? panic("Could not borrow NFT reference")
        let bond = nft as! &ChronoBond.NFT
        
        bonds.append({
          "id": bond.id,
          "principal": bond.principal,
          "maturityDate": bond.maturityDate,
          "yieldRate": bond.yieldRate,
          "strategyID": bond.strategyID
        })
      }
      
      return bonds
    }
  `,
  
  CHECK_BOND_MATURITY: `
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
  `,

  GET_MARKETPLACE_LISTINGS: `
    import NonFungibleToken from 0xNonFungibleToken
    import ChronoBond from 0xChronoBond
    import Marketplace from 0xMarketplace

    access(all) fun main(): [{String: AnyStruct}] {
      let listings: [{String: AnyStruct}] = []
      
      // This is a simplified version - in practice you'd maintain a registry of all sellers
      // For now, we'll return empty array as demonstration
      return listings
    }
  `,

  GET_MARKETPLACE_LISTING: `
    import NonFungibleToken from 0xNonFungibleToken
    import ChronoBond from 0xChronoBond
    import Marketplace from 0xMarketplace

    access(all) fun main(sellerAddress: Address, bondID: UInt64): {String: AnyStruct}? {
      let account = getAccount(sellerAddress)
      
      let saleCollectionRef = account.capabilities.get<&{Marketplace.SaleCollectionPublic}>(/public/ChronoBondSaleCollection)
        .borrow()
      
      if saleCollectionRef == nil {
        return nil
      }
      
      let price = saleCollectionRef!.getPrice(tokenID: bondID)
      if price == nil {
        return nil
      }
      
      let bondRef = saleCollectionRef!.borrowBond(id: bondID)
      if bondRef == nil {
        return nil
      }
      
      let bond = bondRef!
      
      return {
        "bondID": bond.id,
        "seller": sellerAddress,
        "price": price!,
        "principal": bond.principal,
        "maturityDate": bond.maturityDate,
        "yieldRate": bond.yieldRate,
        "strategyID": bond.strategyID
      }
    }
  `
}; 