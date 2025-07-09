// scripts/get_bond_details.cdc
import "NonFungibleToken"
import "ChronoBond"

access(all) fun main(address: Address, id: UInt64): {String: AnyStruct} {
    let account = getAccount(address)
    
    let collectionRef = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(ChronoBond.CollectionPublicPath)
        .borrow() ?? panic("Could not borrow collection reference")
    
    let nft = collectionRef.borrowNFT(id) ?? panic("Could not borrow NFT reference")
    let bond = nft as! &ChronoBond.NFT
    
    return {
        "id": bond.id,
        "principal": bond.principal,
        "maturityDate": bond.maturityDate,
        "yieldRate": bond.yieldRate,
        "strategyID": bond.strategyID
    }
} 