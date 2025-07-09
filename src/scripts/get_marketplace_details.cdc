import "Marketplace"

access(all) struct BondListing {
    access(all) let bondID: UInt64
    access(all) let price: UFix64
    access(all) let isAvailable: Bool

    init(bondID: UInt64, price: UFix64, isAvailable: Bool) {
        self.bondID = bondID
        self.price = price
        self.isAvailable = isAvailable
    }
}

access(all) fun main(sellerAddress: Address): [BondListing] {
    let account = getAccount(sellerAddress)
    
    // Try to get the sale collection, return empty array if not found
    if let saleCollection = account.capabilities.get<&{Marketplace.SaleCollectionPublic}>(/public/ChronoBondSaleCollection).borrow() {
        let bondIDs = saleCollection.getIDs()
        let listings: [BondListing] = []
        
        for bondID in bondIDs {
            if let price = saleCollection.getPrice(tokenID: bondID) {
                let isAvailable = saleCollection.idExists(tokenID: bondID)
                listings.append(BondListing(bondID: bondID, price: price, isAvailable: isAvailable))
            }
        }
        
        return listings
    }
    
    return []
} 