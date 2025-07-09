import "Marketplace"

access(all) fun main(sellerAddress: Address, bondID: UInt64): UFix64? {
    let account = getAccount(sellerAddress)
    
    let saleCollection = account.capabilities.get<&{Marketplace.SaleCollectionPublic}>(/public/ChronoBondSaleCollection)
        .borrow() ?? panic("Could not borrow SaleCollection from seller")
    
    return saleCollection.getPrice(tokenID: bondID)
} 