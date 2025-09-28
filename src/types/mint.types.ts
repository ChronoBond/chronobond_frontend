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
  
  // Actions
  handleInputChange: (field: keyof MintBondParams, value: string | number) => void;
  handleMintBond: () => Promise<void>;
  
  // Constants
  yieldStrategies: YieldStrategy[];
  durationOptions: DurationOption[];
}
