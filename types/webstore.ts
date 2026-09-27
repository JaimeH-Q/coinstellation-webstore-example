export type RarityType = "common" | "rare" | "epic" | "legendary" | "mythic";

export type CategoryType =
  | "ranks"
  | "crates"
  | "spawners"
  | "boosters"
  | "cosmetics"
  | "coins"
  | "permanent"
  | "temporary";

export interface Product {
  id: string;
  name: string;
  price: number; // Base USDC price
  currency?: string;
  description: string;
  features?: string[];
  category: CategoryType;
  rarity?: RarityType;
  badge?: string;
  badgeColor?: string;
  discountPercent?: number;
  minecraftIcon?: "sword" | "crown" | "crate" | "spawner" | "wings" | "booster" | "gem" | "helmet" | "key" | "dragon";
  isBestSeller?: boolean;
  originalPrice?: number;
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity?: number;
  rarity?: RarityType;
  minecraftIcon?: string;
  badge?: string;
}

export interface RecentPurchase {
  id: string;
  username: string;
  productName: string;
  timestamp?: string;
  avatarUrl?: string;
  rarity?: RarityType;
}

export interface DonorOfTheMonth {
  username: string;
  avatarUrl: string;
  message: string;
  totalDonated?: string;
  rankBadge?: string;
}

export type SupportedCurrency = "USDC";

export interface CurrencyRate {
  symbol: SupportedCurrency;
  name: string;
  ratePerUSD: number;
  icon: string;
}

// Alias for backwards compatibility
export type CryptoRate = CurrencyRate;

export interface PaymentRequestPayload {
  destination: string;
  amount: string;
  currency: string;
  description: string;
  packageId?: string;
}

export interface PaymentDetails {
  id: string;
  memo: string;
  uri: string;
  qr: string;
}

export interface PaymentApiResponse {
  payment: PaymentDetails;
  error?: string;
  message?: string;
  record?: any;
}
