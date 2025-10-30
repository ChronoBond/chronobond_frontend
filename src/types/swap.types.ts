export type SupportedToken = "FLOW" | "USDC";

export interface QuoteState {
  token: SupportedToken;
  // For quoteIn: inputAmount is USDC needed; For quoteOut: outputAmount is USDC received
  inputAmount?: string;
  outputAmount?: string;
  pending: boolean;
  error?: string | null;
}


