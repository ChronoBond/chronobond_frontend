// transactions/reinvest-bond-simple.cdc
// Simple reinvest: Redeem mature bond + Mint new bond in atomic transaction
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import ChronoBond from 0xChronoBond
import FlowStakingStrategy from 0xFlowStakingStrategy

transaction(bondID: UInt64, newDuration: UInt64, newYieldRate: UFix64, strategyID: String) {
  let collection: auth(NonFungibleToken.Withdraw) &ChronoBond.Collection
  let receiver: &{NonFungibleToken.CollectionPublic}
  let vault: @{FungibleToken.Vault}

  prepare(signer: auth(Storage, Capabilities) &Account) {
    // Get authorization to withdraw from collection
    self.collection = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &ChronoBond.Collection>(
      from: ChronoBond.CollectionStoragePath
    ) ?? panic("Could not borrow collection from storage")

    // Get receiver capability for new bond
    self.receiver = signer.capabilities.get<&{NonFungibleToken.CollectionPublic}>(
      ChronoBond.CollectionPublicPath
    ).borrow() ?? panic("Could not borrow receiver capability")

    // Create vault for principal amount (will be filled with redeemed principal)
    self.vault <- FlowStakingStrategy.createMockVault(amount: 0.0)
  }

  execute {
    // Step 1: Withdraw the mature bond from collection
    let bond <- self.collection.withdraw(withdrawID: bondID) as! @ChronoBond.NFT

    // Step 2: Extract principal from redeemed bond
    let principal = bond.principal
    
    // Step 3: Destroy old bond NFT (it's being redeemed)
    destroy bond

    // Step 4: Calculate new maturity date
    let currentTime = getCurrentBlock().timestamp
    let maturityTime = currentTime + UFix64(newDuration)

    // Step 5: Mint new bond with redeemed principal
    ChronoBond.mintNFT(
      recipient: self.receiver,
      principal: principal,
      maturityDate: maturityTime,
      yieldRate: newYieldRate,
      strategyID: strategyID
    )

    destroy self.vault
  }
}
