import * as fcl from "@onflow/fcl";
import { toast } from "@/hooks/use-toast";

/**
 * Enhanced error handler for Flow authentication and transactions
 */
export class FlowErrorHandler {
  
  /**
   * Handle authentication errors with specific messaging
   */
  static handleAuthError(error: any): string {
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    
    console.error("🔐 Authentication Error:", error);
    
    // Handle specific error types
    if (errorMessage.includes("Externally Halted")) {
      const message = "Authentication was cancelled by user";
      toast({
        title: "Connection Cancelled",
        description: message,
        variant: "destructive",
      });
      return message;
    }
    
    if (errorMessage.includes("Declined")) {
      const message = "Authentication was declined by user";
      toast({
        title: "Connection Declined", 
        description: message,
        variant: "destructive",
      });
      return message;
    }
    
    if (errorMessage.includes("WalletConnect")) {
      const message = "WalletConnect configuration issue. Please check your project ID.";
      toast({
        title: "Configuration Error",
        description: message,
        variant: "destructive",
      });
      return message;
    }
    
    if (errorMessage.includes("No matching key") || errorMessage.includes("session topic doesn't exist")) {
      const message = "Wallet session expired. Please try connecting again.";
      toast({
        title: "Session Expired",
        description: message,
        variant: "destructive",
      });
      return message;
    }
    
    // Generic error fallback
    const message = `Authentication failed: ${errorMessage}`;
    toast({
      title: "Authentication Failed",
      description: message,
      variant: "destructive",
    });
    return message;
  }
  
  /**
   * Handle transaction errors with specific messaging
   */
  static handleTransactionError(error: any): string {
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    
    console.error("💸 Transaction Error:", error);
    
    if (errorMessage.includes("Insufficient funds")) {
      const message = "Insufficient funds for this transaction";
      toast({
        title: "Insufficient Funds",
        description: message,
        variant: "destructive",
      });
      return message;
    }
    
    if (errorMessage.includes("User rejected")) {
      const message = "Transaction was rejected by user";
      toast({
        title: "Transaction Rejected",
        description: message,
        variant: "destructive",
      });
      return message;
    }
    
    if (errorMessage.includes("Network error")) {
      const message = "Network connection issue. Please try again.";
      toast({
        title: "Network Error",
        description: message,
        variant: "destructive",
      });
      return message;
    }
    
    // Generic transaction error
    const message = `Transaction failed: ${errorMessage}`;
    toast({
      title: "Transaction Failed",
      description: message,
      variant: "destructive",
    });
    return message;
  }
  
  /**
   * Handle script execution errors
   */
  static handleScriptError(error: any): string {
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    
    console.error("📜 Script Error:", error);
    
    const message = `Script execution failed: ${errorMessage}`;
    toast({
      title: "Script Execution Failed",
      description: message,
      variant: "destructive",
    });
    return message;
  }
  
  /**
   * Enhanced authentication with better error handling
   */
  static async authenticateWithErrorHandling(): Promise<any> {
    try {
      // Clear any existing session first
      await fcl.unauthenticate();
      
      // Set up authentication with better error handling
      const user = await fcl.authenticate();
      
      if (!user || !user.loggedIn) {
        throw new Error("Authentication failed - user not logged in");
      }
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      });
      
      return user;
    } catch (error: any) {
      throw new Error(this.handleAuthError(error));
    }
  }
  
  /**
   * Enhanced transaction execution with better error handling
   */
  static async executeTransactionWithErrorHandling(
    transaction: string, 
    args: any[] = []
  ): Promise<any> {
    try {
      const txId = await fcl.mutate({
        cadence: transaction,
        args: args as any,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
      });
      
      toast({
        title: "Transaction Submitted",
        description: "Your transaction is being processed...",
      });
      
      // Wait for transaction to be sealed
      const result = await fcl.tx(txId).onceSealed();
      
      if (result.errorMessage) {
        throw new Error(result.errorMessage);
      }
      
      toast({
        title: "Transaction Successful",
        description: "Your transaction has been completed",
      });
      
      return result;
    } catch (error: any) {
      throw new Error(this.handleTransactionError(error));
    }
  }
  
  /**
   * Enhanced script execution with better error handling
   */
  static async executeScriptWithErrorHandling(
    script: string, 
    args: any[] = []
  ): Promise<any> {
    try {
      const result = await fcl.query({
        cadence: script,
        args: args as any,
      });
      
      return result;
    } catch (error: any) {
      throw new Error(this.handleScriptError(error));
    }
  }
  
  /**
   * Check if error is recoverable
   */
  static isRecoverableError(error: any): boolean {
    const errorMessage = error?.message || error?.toString() || "";
    
    const recoverableErrors = [
      "Externally Halted",
      "Declined",
      "User rejected",
      "session topic doesn't exist",
      "No matching key"
    ];
    
    return recoverableErrors.some(recoverableError => 
      errorMessage.includes(recoverableError)
    );
  }
  
  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: any): string {
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    
    const friendlyMessages: { [key: string]: string } = {
      "Externally Halted": "Connection was cancelled. Please try again.",
      "Declined": "Connection was declined. Please try again.",
      "WalletConnect": "Configuration issue. Please contact support.",
      "No matching key": "Session expired. Please reconnect your wallet.",
      "session topic doesn't exist": "Session expired. Please reconnect your wallet.",
      "Insufficient funds": "You don't have enough funds for this transaction.",
      "User rejected": "Transaction was cancelled by user.",
      "Network error": "Network connection issue. Please check your internet connection."
    };
    
    for (const [key, message] of Object.entries(friendlyMessages)) {
      if (errorMessage.includes(key)) {
        return message;
      }
    }
    
    return "An unexpected error occurred. Please try again.";
  }
}
