import "Marketplace"

access(all) fun main(sellerAddress: Address): [UInt64] {
    let account = getAccount(sellerAddress)
    
    let saleCollection = account.capabilities.get<&{Marketplace.SaleCollectionPublic}>(/public/ChronoBondSaleCollection)
        .borrow() ?? panic("Could not borrow SaleCollection from seller")
    
    return saleCollection.getIDs()
} 