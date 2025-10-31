import { type BondMaturityInfo } from "@/lib/bond-redemption-service";

// Reinvestment configuration from smart contract
export interface ReinvestmentConfig {
  bondID: number;
  owner: string;
  scheduledAt: number; // Unix timestamp
  expectedMaturityDate: number; // Unix timestamp
  newDuration: number; // In seconds
  newYieldRate: number; // As decimal (0.10 = 10%)
  newStrategyID: string;
}

// Tab states
export type ActiveTab = "redeemable" | "pending" | "notifications" | "scheduled";

// Main redeem state
export interface RedeemState {
  activeTab: ActiveTab;
  redeemableBonds: BondMaturityInfo[];
  pendingBonds: BondMaturityInfo[];
  nearingMaturity: BondMaturityInfo[];
  totalRedeemableValue: number;
  loading: boolean;
  error: string | null;
  success: string | null;
  redeeming: { [key: number]: boolean };
}

// Component props interfaces
export interface RedeemHeaderProps {
  redeemableBonds: BondMaturityInfo[];
  pendingBonds: BondMaturityInfo[];
  nearingMaturity: BondMaturityInfo[];
  totalRedeemableValue: number;
  scheduledBondsCount?: number;
}

export interface RedeemTabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  redeemableBonds: BondMaturityInfo[];
  pendingBonds: BondMaturityInfo[];
  nearingMaturity: BondMaturityInfo[];
  scheduledBondsCount?: number;
}

export interface RedeemMessagesProps {
  error: string | null;
  success: string | null;
  onClearMessages: () => void;
}

export interface RedeemableBondsProps {
  redeemableBonds: BondMaturityInfo[];
  loading: boolean;
  redeeming: { [key: number]: boolean };
  totalRedeemableValue: number;
  onRefresh: () => void;
  onRedeemBond: (bond: BondMaturityInfo) => void;
  onRedeemAllBonds: () => void;
}

export interface PendingBondsProps {
  pendingBonds: BondMaturityInfo[];
  loading: boolean;
  onRefresh: () => void;
}

export interface NotificationsProps {
  nearingMaturity: BondMaturityInfo[];
  loading: boolean;
  onRefresh: () => void;
}

export interface BondRedemptionCardProps {
  bond: BondMaturityInfo;
  onRedeem: (bond: BondMaturityInfo) => void;
  isRedeeming: boolean;
}

export interface BondPendingCardProps {
  bond: BondMaturityInfo;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RedeemWalletPromptProps {
  // No props needed for wallet prompt
}

// Custom hook return type
export interface RedeemHooksReturn {
  // State
  activeTab: ActiveTab;
  redeemableBonds: BondMaturityInfo[];
  pendingBonds: BondMaturityInfo[];
  nearingMaturity: BondMaturityInfo[];
  totalRedeemableValue: number;
  loading: boolean;
  error: string | null;
  success: string | null;
  redeeming: { [key: number]: boolean };
  // Reinvestment state
  scheduledBonds?: { [bondID: number]: ReinvestmentConfig };
  loadingReinvestStatus?: boolean;
  schedulingReinvestment?: { [bondID: number]: boolean };
  cancelingReinvestment?: { [bondID: number]: boolean };
  // Modal state (optional)
  redeemModalOpen?: boolean;
  selectedBond?: BondMaturityInfo | null;
  receiveToken?: "FLOW" | "USDC";
  receiveQuote?: string | null;
  quoteLoading?: boolean;
  
  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  loadBondData: () => Promise<void>;
  handleRedeemBond: (bond: BondMaturityInfo) => Promise<void>;
  handleRedeemAllBonds: () => Promise<void>;
  clearMessages: () => void;
  // Reinvestment actions
  loadReinvestmentStatus?: () => Promise<void>;
  scheduleReinvestment?: (bondID: number, duration: number, yieldRate: number, strategyID: string) => Promise<void>;
  cancelReinvestment?: (bondID: number) => Promise<void>;
  // Modal actions (optional)
  setRedeemModalOpen?: (open: boolean) => void;
  setReceiveToken?: (token: "FLOW" | "USDC") => void;
  confirmRedeem?: () => Promise<void>;
}
