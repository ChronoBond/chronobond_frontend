import { type BondData, type BondDetails } from "@/lib/chronobond-service";

// Real transaction state
export type ListingState = 'idle' | 'pending' | 'success' | 'error'

export interface ListingStatus {
  state: ListingState
  statusString: string
  txId: string | null
}

export interface HoldingsState {
  selectedBond: BondData | null;
  selectedBondDetails: BondDetails | null;
  listingPrice: string;
  showListingForm: boolean;
  isLoading: boolean;
  bonds: BondData[];
  listingState: ListingStatus;
}

export interface BondCardProps {
  bond: BondData;
  onListBond: () => void;
  onRedeemBond: () => void;
  isMatured: boolean;
  formatFlow: (amount: number) => string;
  formatDate: (timestamp: number) => string;
  calculateCurrentYield: (bond: BondData) => number;
}

export interface PortfolioSummaryProps {
  bonds: BondData[];
  formatFlow: (amount: number) => string;
  calculateCurrentYield: (bond: BondData) => number;
}

export interface ListingModalProps {
  isOpen: boolean;
  selectedBond: BondData | null;
  selectedBondDetails: BondDetails | null;
  listingPrice: string;
  listingState: ListingStatus;
  onClose: () => void;
  onPriceChange: (price: string) => void;
  onConfirmListing: () => void;
  formatFlow: (amount: number) => string;
}

export interface HoldingsHooksReturn {
  bonds: BondData[];
  isLoading: boolean;
  selectedBond: BondData | null;
  selectedBondDetails: BondDetails | null;
  listingPrice: string;
  showListingForm: boolean;
  listingState: ListingStatus;
  loadUserBonds: () => Promise<void>;
  handleListBond: (bond: BondData) => Promise<void>;
  handleRedeemBond: (bond: BondData) => Promise<void>;
  handleConfirmListing: () => Promise<void>;
  setShowListingForm: (show: boolean) => void;
  setSelectedBond: (bond: BondData | null) => void;
  setSelectedBondDetails: (details: BondDetails | null) => void;
  setListingPrice: (price: string) => void;
  setListingState: (state: ListingStatus) => void;
  formatFlow: (amount: number) => string;
  formatDate: (timestamp: number) => string;
  isMatured: (maturityDate: number) => boolean;
  calculateCurrentYield: (bond: BondData) => number;
}
