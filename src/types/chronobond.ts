// ChronoBond Types

export interface Bond {
  id: string;
  principal: string;
  maturityDate: string;
  yieldRate: string;
  owner: string;
  isMatured: boolean;
  yieldGenerated: string;
  strategy: string;
}

export interface BondMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: BondAttribute[];
}

export interface BondAttribute {
  trait_type: string;
  value: string;
}

export interface MarketplaceListing {
  id: string;
  bondId: string;
  seller: string;
  price: string;
  isActive: boolean;
  listedAt: string;
  bond?: Bond;
}

export interface YieldStrategy {
  name: string;
  description: string;
  expectedYield: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

export interface UserPortfolio {
  totalBonds: number;
  totalValue: string;
  totalYieldGenerated: string;
  bonds: Bond[];
}

export interface TransactionStatus {
  id: string;
  status: number;
  statusString: string;
  errorMessage?: string;
}

export interface MintBondParams {
  amount: string;
  lockupPeriod: number; // in days
  strategyID: string;
}

export interface ListBondParams {
  bondId: string;
  price: string;
}

export interface PurchaseBondParams {
  listingId: string;
} 