import * as fcl from "@onflow/fcl";

export const initializeFlowTestnet = () => {
  // Check if we have a valid WalletConnect project ID
  const hasValidWalletConnectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID && 
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID !== "your_walletconnect_project_id_here" &&
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.length > 10;

  // Default to POP/RPC to avoid iframe blocking on some browsers/environments
  const discoveryMethod = process.env.NEXT_PUBLIC_FCL_DISCOVERY_METHOD || "POP/RPC";

  const config: any = {
    "accessNode.api": process.env.NEXT_PUBLIC_ACCESS_NODE_URL || "https://rest-testnet.onflow.org",
    "discovery.wallet": process.env.NEXT_PUBLIC_DISCOVERY_WALLET || "https://fcl-discovery.onflow.org/testnet/authn",
    "app.detail.title": process.env.NEXT_PUBLIC_APP_TITLE || "ChronoBond",
    // Use absolute HTTPS icon to avoid cross-origin/iframe issues in discovery
    "app.detail.icon": process.env.NEXT_PUBLIC_APP_ICON || "https://fcl-discovery.onflow.org/images/flow-logo.png",
    // Ensure network is set explicitly
    "flow.network": "testnet",
    
    // Discovery method (configurable). Options: POP/RPC or IFRAME/RPC
    "discovery.wallet.method": discoveryMethod,
    "discovery.wallet.method.default": discoveryMethod,
    
    // Additional configuration for better error handling
    "fcl.limit": 1000,
    "fcl.txPollRate": 1000,
    "fcl.eventPollRate": 1000,
    "fcl.eventPollRateMultiplier": 1.5,
    "fcl.maxEventPollRate": 5000,
    "fcl.warn": false,
    
    // Explicitly disable WalletConnect unless project ID is provided
    "fcl.walletConnect.enabled": hasValidWalletConnectId ? true : false,
    
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
  };

  // Add WalletConnect configuration only if we have a valid project ID
  if (hasValidWalletConnectId) {
    config["fcl.walletConnect.projectId"] = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    config["fcl.walletConnect.requiredMethods"] = ["eth_sendTransaction", "eth_signTransaction", "eth_sign"];
    config["fcl.walletConnect.optionalMethods"] = ["eth_accounts", "eth_requestAccounts"];
  }

  fcl.config(config);
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

  MINT_WITH_USDC: `
    import FungibleToken from 0xFungibleToken
    import NonFungibleToken from 0xNonFungibleToken
    import FlowToken from 0xFlowToken
    import ChronoBond from 0xChronoBond
    import FlowStakingStrategy from 0xFlowStakingStrategy

    transaction(
        usdcAmount: UFix64,
        minFlowToMint: UFix64,
        duration: UInt64,
        yieldRate: UFix64,
        strategyID: String
    ) {
        let receiver: &{NonFungibleToken.CollectionPublic}
        let flowAmount: UFix64
        
        prepare(signer: auth(Storage, Capabilities) &Account) {
            self.receiver = signer.capabilities.get<&{NonFungibleToken.CollectionPublic}>(
                ChronoBond.CollectionPublicPath
            ).borrow() ?? panic("Could not borrow receiver capability")
            
            // Mock swap: 1 USDC = 10 FLOW (testnet demo rate)
            self.flowAmount = usdcAmount * 10.0
            
            // Check slippage
            assert(self.flowAmount >= minFlowToMint, message: "Slippage exceeded")
        }
        
        execute {
            let currentTime = getCurrentBlock().timestamp
            let maturityTime = currentTime + UFix64(duration)
            
            ChronoBond.mintNFT(
                recipient: self.receiver,
                principal: self.flowAmount,
                maturityDate: maturityTime,
                yieldRate: yieldRate,
                strategyID: strategyID
            )
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
  `,

  REINVEST_BOND_SIMPLE: `
    import FungibleToken from 0xFungibleToken
    import NonFungibleToken from 0xNonFungibleToken
    import ChronoBond from 0xChronoBond
    import FlowStakingStrategy from 0xFlowStakingStrategy

    transaction(bondID: UInt64, newDuration: UInt64, newYieldRate: UFix64, strategyID: String) {
      let collection: auth(NonFungibleToken.Withdraw) &ChronoBond.Collection
      let receiver: &{NonFungibleToken.CollectionPublic}
      let vault: @{FungibleToken.Vault}

      prepare(signer: auth(Storage, Capabilities) &Account) {
        self.collection = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &ChronoBond.Collection>(
          from: ChronoBond.CollectionStoragePath
        ) ?? panic("Could not borrow collection from storage")

        self.receiver = signer.capabilities.get<&{NonFungibleToken.CollectionPublic}>(
          ChronoBond.CollectionPublicPath
        ).borrow() ?? panic("Could not borrow receiver capability")

        self.vault <- FlowStakingStrategy.createMockVault(amount: 0.0)
      }

      execute {
        let bond <- self.collection.withdraw(withdrawID: bondID) as! @ChronoBond.NFT

        let principal = bond.principal
        
        destroy bond

        let currentTime = getCurrentBlock().timestamp
        let maturityTime = currentTime + UFix64(newDuration)

        ChronoBond.mintNFT(
          recipient: self.receiver,
          principal: principal,
          maturityDate: maturityTime,
          yieldRate: newYieldRate,
          strategyID: strategyID
        )

        destroy self.vault
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