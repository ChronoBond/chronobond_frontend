import { type MarketplaceListing } from "@/lib/marketplace-service";
import { type BondData } from "@/lib/chronobond-service";

// Transaction states
export type TransactionState = "idle" | "listing" | "purchasing" | "withdrawing" | "success" | "error";

export interface TransactionStatus {
  state: TransactionState;
  statusString: string;
  txId: string | null;
}

// Tab states
export type ActiveTab = "buy" | "sell" | "manage";

// Main marketplace state
export interface MarketplaceState {
  activeTab: ActiveTab;
  marketplaceListings: MarketplaceListing[];
  userBonds: BondData[];
  userListings: MarketplaceListing[];
  listingPrices: { [key: number]: string };
  knownSellers: string[];
  loading: boolean;
  txStatus: TransactionStatus;
}

// Component props interfaces
export interface MarketplaceTabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export interface MarketplaceSummaryProps {
  activeTab: ActiveTab;
  marketplaceListings: MarketplaceListing[];
  userBonds: BondData[];
  userListings: MarketplaceListing[];
  formatFlow: (amount: number) => string;
}

export interface MarketplaceListingCardProps {
  listing: MarketplaceListing;
  onPurchase: (listing: MarketplaceListing) => Promise<void>;
  isPurchasing: boolean;
  formatFlow: (amount: number) => string;
}

export interface MarketplaceBondCardProps {
  bond: BondData;
  listingPrice: string;
  onPriceChange: (bondId: number, price: string) => void;
  onListBond: (bondId: number, price: string) => Promise<void>;
  isListing: boolean;
  formatFlow: (amount: number) => string;
  formatDate: (timestamp: number) => string;
  calculateCurrentYield: (bond: BondData) => number;
}

export interface MarketplaceManageCardProps {
  listing: MarketplaceListing;
  onWithdraw: (listing: MarketplaceListing) => Promise<void>;
  isWithdrawing: boolean;
  formatFlow: (amount: number) => string;
}

export interface MarketplaceEmptyStateProps {
  activeTab: ActiveTab;
  onRefresh: () => void;
}

export interface MarketplaceHeaderProps {
  activeTab: ActiveTab;
  onRefresh: () => void;
  loading: boolean;
}

export interface MarketplaceTransactionStatusProps {
  txStatus: TransactionStatus;
}

// Custom hook return type
export interface MarketplaceHooksReturn {
  // State
  activeTab: ActiveTab;
  marketplaceListings: MarketplaceListing[];
  userBonds: BondData[];
  userListings: MarketplaceListing[];
  listingPrices: { [key: number]: string };
  knownSellers: string[];
  loading: boolean;
  txStatus: TransactionStatus;
  buyModalOpen?: boolean;
  selectedListing?: MarketplaceListing | null;
  payToken?: "FLOW" | "USDC";
  payQuote?: string | null;
  quoteLoading?: boolean;
  flowBalance?: number;
  
  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  loadData: () => Promise<void>;
  handleListBond: (bondId: number, price: string) => Promise<void>;
  handlePurchaseBond: (listing: MarketplaceListing) => Promise<void>;
  handleWithdrawListing: (listing: MarketplaceListing) => Promise<void>;
  handlePriceChange: (bondId: number, price: string) => void;
  setBuyModalOpen?: (open: boolean) => void;
  setPayToken?: (token: "FLOW" | "USDC") => void;
  confirmPurchase?: () => Promise<void>;
  
  // Utilities
  formatFlow: (amount: number) => string;
  formatDate: (timestamp: number) => string;
  isMatured: (maturityDate: number) => boolean;
  calculateCurrentYield: (bond: BondData) => number;
}
