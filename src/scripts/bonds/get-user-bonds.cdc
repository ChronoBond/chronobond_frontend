import ChronoBond from "ChronoBond"
import NonFungibleToken from "NonFungibleToken"

access(all)
fun main(userAddress: Address): [ChronoBond.BondData] {
    let account = getAccount(userAddress)
    
    let collectionRef = account.capabilities.borrow<&ChronoBond.Collection>(
        ChronoBond.CollectionPublicPath
    ) ?? panic("Could not borrow reference to user's bond collection")
    
    let bondIds = collectionRef.getIDs()
    let bonds: [ChronoBond.BondData] = []
    
    for bondId in bondIds {
        let bondRef = collectionRef.borrowBond(id: bondId)
        if bondRef != nil {
            bonds.append(bondRef!.getBondData())
        }
    }
    
    return bonds
} 