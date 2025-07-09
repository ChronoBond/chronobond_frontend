import "Marketplace"

access(all) fun main(address: Address): {String: AnyStruct} {
    let account = getAccount(address)
    
    // Check if storage resource exists
    let hasResource = account.storage.check<&Marketplace.SaleCollection>(from: /storage/ChronoBondSaleCollection)
    
    // Check if public capability exists
    let cap = account.capabilities.get<&{Marketplace.SaleCollectionPublic}>(/public/ChronoBondSaleCollection)
    let capValid = cap.check()
    
    // Try to borrow capability
    var canBorrow = false
    if capValid {
        canBorrow = cap.borrow() != nil
    }
    
    return {
        "hasStorageResource": hasResource,
        "capabilityExists": capValid,
        "canBorrowCapability": canBorrow
    }
} 