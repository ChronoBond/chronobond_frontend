import { type BondMaturityInfo } from "@/lib/bond-redemption-service";

// Tab states
export type ActiveTab = "redeemable" | "pending" | "notifications";

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
}

export interface RedeemTabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  redeemableBonds: BondMaturityInfo[];
  pendingBonds: BondMaturityInfo[];
  nearingMaturity: BondMaturityInfo[];
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
  
  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  loadBondData: () => Promise<void>;
  handleRedeemBond: (bond: BondMaturityInfo) => Promise<void>;
  handleRedeemAllBonds: () => Promise<void>;
  clearMessages: () => void;
}
