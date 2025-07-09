import ChronoBond from "ChronoBond"

access(all)
fun main(bondId: UInt64, ownerAddress: Address): ChronoBond.BondData? {
    let account = getAccount(ownerAddress)
    
    let collectionRef = account.capabilities.borrow<&ChronoBond.Collection>(
        ChronoBond.CollectionPublicPath
    )
    if collectionRef == nil {
        return nil
    }
    
    let bondRef = collectionRef.borrowBond(id: bondId)
    if bondRef == nil {
        return nil
    }
    
    return bondRef!.getBondData()
} 