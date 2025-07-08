"use client";

import { useFlowCurrentUser } from "@onflow/kit";
import { Button } from "./ui/button";
import { Wallet, LogOut } from "lucide-react";

export default function WalletConnection() {
  const { user, authenticate, unauthenticate } = useFlowCurrentUser();

  const handleConnect = () => {
    authenticate();
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
            {user.addr ? formatAddress(user.addr) : 'Connected'}
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
    <Button
      onClick={handleConnect}
      className="flex items-center gap-2"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </Button>
  );
} 