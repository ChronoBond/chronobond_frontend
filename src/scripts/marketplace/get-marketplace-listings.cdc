import Marketplace from "Marketplace"
import ChronoBond from "ChronoBond"

access(all)
fun main(): [Marketplace.ListingData] {
    let marketplaceRef = getAccount(0x01).capabilities.borrow<&Marketplace.MarketplacePublic>(
        Marketplace.MarketplacePublicPath
    ) ?? panic("Could not borrow reference to marketplace")
    
    return marketplaceRef.getActiveListings()
} 