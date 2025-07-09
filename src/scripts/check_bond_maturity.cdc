// scripts/check_bond_maturity.cdc
import "NonFungibleToken"
import "ChronoBond"

access(all) fun main(address: Address, bondID: UInt64): {String: AnyStruct} {
    let account = getAccount(address)
    
    let collectionRef = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(ChronoBond.CollectionPublicPath)
        .borrow() ?? panic("Could not borrow collection reference")
    
    let nft = collectionRef.borrowNFT(bondID) ?? panic("Could not borrow NFT reference")
    let bond = nft as! &ChronoBond.NFT
    
    let currentTime = getCurrentBlock().timestamp
    let isMatured = currentTime >= bond.maturityDate
    let timeUntilMaturity = isMatured ? 0.0 : bond.maturityDate - currentTime
    
    // Calculate expected total return
    let expectedYield = bond.principal * bond.yieldRate
    let expectedTotal = bond.principal + expectedYield
    
    return {
        "bondID": bond.id,
        "principal": bond.principal,
        "yieldRate": bond.yieldRate,
        "strategyID": bond.strategyID,
        "maturityDate": bond.maturityDate,
        "currentTime": currentTime,
        "isMatured": isMatured,
        "timeUntilMaturity": timeUntilMaturity,
        "expectedYield": expectedYield,
        "expectedTotal": expectedTotal
    }
} 