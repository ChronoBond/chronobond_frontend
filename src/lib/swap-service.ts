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
  async quoteIn(params: QuoteInParams): Promise<QuoteResponse | null> {
    // Expected backend: POST /swapper/quote-in
    return safeFetch<QuoteResponse>("/swapper/quote-in", params);
  }

  async quoteOut(params: QuoteOutParams): Promise<QuoteResponse | null> {
    // Expected backend: POST /swapper/quote-out
    return safeFetch<QuoteResponse>("/swapper/quote-out", params);
  }
}

export const swapService = new SwapService();


