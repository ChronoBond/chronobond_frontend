import "Marketplace"

access(all) fun main(address: Address): Bool {
    let account = getAccount(address)
    let cap = account.capabilities.get<&{Marketplace.SaleCollectionPublic}>(/public/ChronoBondSaleCollection)
    return cap.check()
} 