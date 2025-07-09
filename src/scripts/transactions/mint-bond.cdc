import ChronoBond from "ChronoBond"
import FungibleToken from "FungibleToken"
import FlowToken from "FlowToken"

transaction(principal: UFix64, duration: UInt64, strategy: String) {
    let signerCollection: &ChronoBond.Collection
    let paymentVault: @FlowToken.Vault
    
    prepare(signer: &Account) {
        // Get reference to signer's bond collection
        self.signerCollection = signer.capabilities.borrow<&ChronoBond.Collection>(
            ChronoBond.CollectionPublicPath
        ) ?? panic("Could not borrow reference to signer's bond collection")
        
        // Withdraw payment from signer's Flow vault
        let vaultRef = signer.storage.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to signer's Flow vault")
        
        self.paymentVault <- vaultRef.withdraw(amount: principal)
    }
    
    execute {
        let newBond <- ChronoBond.mintBond(
            principal: <-self.paymentVault,
            duration: duration,
            strategy: strategy
        )
        
        self.signerCollection.deposit(token: <-newBond)
        
        log("Bond minted successfully")
    }
} 