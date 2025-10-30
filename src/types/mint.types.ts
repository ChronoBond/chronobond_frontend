import { type MintBondParams, type YieldStrategy } from "@/types/chronobond";

// Transaction states
export type TransactionState = "idle" | "checking" | "setup" | "minting" | "success" | "error";

export interface TransactionStatus {
  state: TransactionState;
  statusString: string;
  txId: string | null;
}

// Duration options
export interface DurationOption {
  value: number;
  label: string;
  multiplier: number;
}

// Main mint state
export interface MintState {
  formData: MintBondParams;
  txStatus: TransactionStatus;
  selectedStrategy: YieldStrategy | undefined;
  selectedDuration: DurationOption | undefined;
  estimatedYield: string;
}

// Component props interfaces
export interface MintFormProps {
  formData: MintBondParams;
  txStatus: TransactionStatus;
  onInputChange: (field: keyof MintBondParams, value: string | number) => void;
  onMintBond: () => void;
  yieldStrategies: YieldStrategy[];
  durationOptions: DurationOption[];
  // New for cross-asset mint
  paymentToken?: "FLOW" | "USDC";
  onPaymentTokenChange?: (token: "FLOW" | "USDC") => void;
  usdcQuote?: string | null; // formatted text like "~150.50 USDC"
}

export interface MintSummaryProps {
  selectedStrategy: YieldStrategy | undefined;
  selectedDuration: DurationOption | undefined;
  formData: MintBondParams;
  estimatedYield: string;
}

export interface MintTransactionStatusProps {
  txStatus: TransactionStatus;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MintWalletPromptProps {
  // No props needed for wallet prompt
}

// Custom hook return type
export interface MintHooksReturn {
  // State
  formData: MintBondParams;
  txStatus: TransactionStatus;
  selectedStrategy: YieldStrategy | undefined;
  selectedDuration: DurationOption | undefined;
  estimatedYield: string;
  paymentToken?: "FLOW" | "USDC";
  usdcQuote?: string | null;
  quoteLoading?: boolean;
  
  // Actions
  handleInputChange: (field: keyof MintBondParams, value: string | number) => void;
  handleMintBond: () => Promise<void>;
  setPaymentToken?: (token: "FLOW" | "USDC") => void;
  
  // Constants
  yieldStrategies: YieldStrategy[];
  durationOptions: DurationOption[];
}
