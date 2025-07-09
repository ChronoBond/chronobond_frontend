import "Marketplace"
import "ChronoBond"
import "NonFungibleToken"

access(all) struct DetailedBondListing {
    access(all) let bondID: UInt64
    access(all) let price: UFix64
    access(all) let seller: Address
    access(all) let principal: UFix64
    access(all) let yieldRate: UFix64
    access(all) let maturityDate: UFix64
    access(all) let strategyID: String
    access(all) let isAvailable: Bool

    init(
        bondID: UInt64, 
        price: UFix64, 
        seller: Address,
        principal: UFix64,
        yieldRate: UFix64,
        maturityDate: UFix64,
        strategyID: String,
        isAvailable: Bool
    ) {
        self.bondID = bondID
        self.price = price
        self.seller = seller
        self.principal = principal
        self.yieldRate = yieldRate
        self.maturityDate = maturityDate
        self.strategyID = strategyID
        self.isAvailable = isAvailable
    }
}

access(all) fun main(sellerAddresses: [Address]): [DetailedBondListing] {
    let allListings: [DetailedBondListing] = []
    
    for sellerAddress in sellerAddresses {
        let account = getAccount(sellerAddress)
        
        // Try to get the sale collection
        if let saleCollection = account.capabilities.get<&{Marketplace.SaleCollectionPublic}>(/public/ChronoBondSaleCollection).borrow() {
            let bondIDs = saleCollection.getIDs()
            
            for bondID in bondIDs {
                if let price = saleCollection.getPrice(tokenID: bondID) {
                    let isAvailable = saleCollection.idExists(tokenID: bondID)
                    
                    // Try to get bond details from the marketplace
                    if let bondRef = saleCollection.borrowBond(id: bondID) {
                        let bond = bondRef as! &ChronoBond.NFT
                        
                        allListings.append(DetailedBondListing(
                            bondID: bondID,
                            price: price,
                            seller: sellerAddress,
                            principal: bond.principal,
                            yieldRate: bond.yieldRate,
                            maturityDate: bond.maturityDate,
                            strategyID: bond.strategyID,
                            isAvailable: isAvailable
                        ))
                    } else {
                        // Fallback: create listing with basic info if bond details can't be accessed
                        allListings.append(DetailedBondListing(
                            bondID: bondID,
                            price: price,
                            seller: sellerAddress,
                            principal: 0.0,
                            yieldRate: 0.0,
                            maturityDate: 0.0,
                            strategyID: "unknown",
                            isAvailable: isAvailable
                        ))
                    }
                }
            }
        }
    }
    
    return allListings
} 