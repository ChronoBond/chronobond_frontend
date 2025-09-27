import * as fcl from "@onflow/fcl";
import { toast } from "@/hooks/use-toast";
import { FlowErrorHandler } from "./flow-error-handler";

/**
 * Enhanced authentication with better error handling
 */
export const authenticateWithFlow = async () => {
  try {
    return await FlowErrorHandler.authenticateWithErrorHandling();
  } catch (error: any) {
    // Re-throw the error with enhanced messaging
    throw new Error(FlowErrorHandler.getUserFriendlyMessage(error));
  }
};

/**
 * Enhanced logout with cleanup
 */
export const logoutFromFlow = async () => {
  try {
    await fcl.unauthenticate();
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from your wallet",
    });
    return true;
  } catch (error: any) {
    toast({
      title: "Logout Error",
      description: "Failed to properly disconnect. Please try again.",
      variant: "destructive",
    });
    // Even if logout fails, we should still clear local state
    return false;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await fcl.currentUser;
    return user && (user as any).loggedIn;
  } catch (error) {
    toast({
      title: "Authentication Check Failed",
      description: "Unable to verify authentication status",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Get current user with error handling
 */
export const getCurrentUser = async () => {
  try {
    const user = await fcl.currentUser;
    return user;
  } catch (error) {
    toast({
      title: "User Data Error",
      description: "Unable to retrieve user information",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Enhanced transaction execution with better error handling
 */
export const executeTransaction = async (transaction: string, args: any[] = []) => {
  try {
    return await FlowErrorHandler.executeTransactionWithErrorHandling(transaction, args);
  } catch (error: any) {
    throw new Error(FlowErrorHandler.getUserFriendlyMessage(error));
  }
};

/**
 * Enhanced script execution with better error handling
 */
export const executeScript = async (script: string, args: any[] = []) => {
  try {
    return await FlowErrorHandler.executeScriptWithErrorHandling(script, args);
  } catch (error: any) {
    throw new Error(FlowErrorHandler.getUserFriendlyMessage(error));
  }
};
