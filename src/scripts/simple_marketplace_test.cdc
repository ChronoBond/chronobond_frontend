import "Marketplace"

access(all) fun main(address: Address): String {
    let account = getAccount(address)
    
    // Try to get the capability
    let cap = account.capabilities.get<&{Marketplace.SaleCollectionPublic}>(/public/ChronoBondSaleCollection)
    
    // Check if capability is valid
    if !cap.check() {
        return "Capability does not exist or is invalid"
    }
    
    // Try to borrow
    if let saleCollection = cap.borrow() {
        let ids = saleCollection.getIDs()
        return "Success! Found ".concat(ids.length.toString()).concat(" bonds for sale")
    } else {
        return "Capability exists but cannot borrow"
    }
} 