import ChronoBond from "ChronoBond"
import Marketplace from "Marketplace"

transaction(bondId: UInt64, price: UFix64) {
    let signerCollection: &ChronoBond.Collection
    let marketplaceRef: &Marketplace.Marketplace
    
    prepare(signer: &Account) {
        // Get reference to signer's bond collection
        self.signerCollection = signer.capabilities.borrow<&ChronoBond.Collection>(
            ChronoBond.CollectionPublicPath
        ) ?? panic("Could not borrow reference to signer's bond collection")
        
        // Get reference to marketplace
        self.marketplaceRef = signer.storage.borrow<&Marketplace.Marketplace>(
            from: Marketplace.MarketplaceStoragePath
        ) ?? panic("Could not borrow reference to marketplace")
    }
    
    execute {
        let bond <- self.signerCollection.withdraw(withdrawID: bondId) as! @ChronoBond.NFT
        
        self.marketplaceRef.listBond(bond: <-bond, price: price)
        
        log("Bond listed successfully")
    }
} 