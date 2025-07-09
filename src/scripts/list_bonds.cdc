// scripts/list_bonds.cdc
import "NonFungibleToken"
import "ChronoBond"

access(all) fun main(address: Address): [{String: AnyStruct}] {
    let account = getAccount(address)
    
    let collectionRef = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(ChronoBond.CollectionPublicPath)
        .borrow() ?? panic("Could not borrow collection reference")
    
    let ids = collectionRef.getIDs()
    let bonds: [{String: AnyStruct}] = []
    
    for id in ids {
        let nft = collectionRef.borrowNFT(id) ?? panic("Could not borrow NFT reference")
        let bond = nft as! &ChronoBond.NFT
        
        bonds.append({
            "id": bond.id,
            "principal": bond.principal,
            "maturityDate": bond.maturityDate,
            "yieldRate": bond.yieldRate,
            "strategyID": bond.strategyID
        })
    }
    
    return bonds
} 