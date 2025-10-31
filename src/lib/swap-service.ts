// src/lib/swap-service.ts
import { toast } from "@/hooks/use-toast";

export type SupportedToken = "FLOW" | "USDC";

export interface QuoteInParams {
  // Pay with fromToken to receive exact toTokenAmount
  fromToken: SupportedToken;
  toToken: SupportedToken; // typically "FLOW"
  toTokenAmount: string; // desired exact output amount (e.g., FLOW to mint)
}

export interface QuoteOutParams {
  // Swap exact fromTokenAmount to receive estimated toToken
  fromToken: SupportedToken; // typically "FLOW"
  toToken: SupportedToken; // e.g., "USDC"
  fromTokenAmount: string; // exact FLOW amount being redeemed/sold
}

export interface QuoteResponse {
  price: string; // price ratio from backend (optional)
  inputAmount?: string; // how much fromToken required (for quoteIn)
  outputAmount?: string; // how much toToken received (for quoteOut)
  slippageBps?: number;
  expiresAt?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// MockUSDC <-> FLOW exchange rate on testnet: 1 USDC = 10 FLOW
const MOCK_EXCHANGE_RATE = 10;

async function safeFetch<T>(path: string, payload: unknown): Promise<T | null> {
  if (!API_BASE) {
    // Backend not wired yet; surface a soft warning and return null
    return null;
  }
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (error: any) {
    toast({
      title: "Quote Failed",
      description: error?.message || "Unable to fetch swap quote",
      variant: "destructive",
    });
    return null;
  }
}

export class SwapService {
  /**
   * Quote for swapping exact input amount of fromToken
   * Returns how much toToken you will receive
   * For USDC -> FLOW: 1 USDC = 10 FLOW (mock rate on testnet)
   */
  async quoteOut(params: QuoteOutParams): Promise<QuoteResponse | null> {
    // Try backend first, fallback to mock rate for testnet
    const backendQuote = await safeFetch<QuoteResponse>("/swapper/quote-out", params);
    
    if (backendQuote) {
      return backendQuote;
    }

    // Fallback to mock rate for testnet (USDC -> FLOW)
    if (params.fromToken === "USDC" && params.toToken === "FLOW") {
      const outputAmount = (parseFloat(params.fromTokenAmount) * MOCK_EXCHANGE_RATE).toFixed(8);
      return {
        price: MOCK_EXCHANGE_RATE.toString(),
        outputAmount: outputAmount,
        slippageBps: 0, // No slippage for mock
        expiresAt: Date.now() + 60000, // 1 minute validity
      };
    }

    // Fallback to mock rate for testnet (FLOW -> USDC)
    if (params.fromToken === "FLOW" && params.toToken === "USDC") {
      const outputAmount = (parseFloat(params.fromTokenAmount) / MOCK_EXCHANGE_RATE).toFixed(8);
      return {
        price: (1 / MOCK_EXCHANGE_RATE).toFixed(8),
        outputAmount: outputAmount,
        slippageBps: 0, // No slippage for mock
        expiresAt: Date.now() + 60000, // 1 minute validity
      };
    }

    return null;
  }

  /**
   * Quote for receiving exact output amount of toToken
   * Returns how much fromToken you need to pay
   * For USDC -> FLOW: 1 USDC = 10 FLOW (mock rate on testnet)
   */
  async quoteIn(params: QuoteInParams): Promise<QuoteResponse | null> {
    // Try backend first, fallback to mock rate for testnet
    const backendQuote = await safeFetch<QuoteResponse>("/swapper/quote-in", params);
    
    if (backendQuote) {
      return backendQuote;
    }

    // Fallback to mock rate for testnet (USDC -> FLOW)
    if (params.fromToken === "USDC" && params.toToken === "FLOW") {
      const inputAmount = (parseFloat(params.toTokenAmount) / MOCK_EXCHANGE_RATE).toFixed(8);
      return {
        price: MOCK_EXCHANGE_RATE.toString(),
        inputAmount: inputAmount,
        slippageBps: 0, // No slippage for mock
        expiresAt: Date.now() + 60000, // 1 minute validity
      };
    }

    // Fallback to mock rate for testnet (FLOW -> USDC)
    if (params.fromToken === "FLOW" && params.toToken === "USDC") {
      const inputAmount = (parseFloat(params.toTokenAmount) * MOCK_EXCHANGE_RATE).toFixed(8);
      return {
        price: (1 / MOCK_EXCHANGE_RATE).toFixed(8),
        inputAmount: inputAmount,
        slippageBps: 0, // No slippage for mock
        expiresAt: Date.now() + 60000, // 1 minute validity
      };
    }

    return null;
  }
}

export const swapService = new SwapService();


