"use client";

import { useFlowCurrentUser } from "@onflow/kit";
import { Button } from "./ui/button";
import { Wallet, LogOut, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function WalletConnection() {
  const { user, authenticate, unauthenticate } = useFlowCurrentUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await authenticate();
    } catch (err) {
      /* console.error("Wallet connection error:", err); */
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    unauthenticate();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (user?.loggedIn) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Wallet className="w-4 h-4" />
          <span className="text-sm font-medium">
            {user.addr ? formatAddress(user.addr) : "Connected"}
          </span>
        </div>
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    </div>
  );
}
