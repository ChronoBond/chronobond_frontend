"use client";

import { useEffect } from "react";
import { initializeFlowTestnet } from "@/lib/flow-config";

interface FlowConfigProviderProps {
  children: React.ReactNode;
}

export function FlowConfigProvider({ children }: FlowConfigProviderProps) {
  useEffect(() => {
    // Initialize Flow testnet configuration on client side
    initializeFlowTestnet();
  }, []);

  return <>{children}</>;
} 