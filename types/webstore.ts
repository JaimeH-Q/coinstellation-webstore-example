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
  price: number; // Base USD price
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
  isCryptoBonus?: boolean;
  cryptoBonusAmount?: string;
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
  cryptoPaid?: string;
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

export type SupportedCurrency = "USD" | "EUR" | "ARS" | "USDT" | "SOL" | "ETH" | "TON" | "BTC" | "XLM";

export interface CryptoRate {
  symbol: SupportedCurrency;
  name: string;
  ratePerUSD: number;
  icon: string;
  isCrypto: boolean;
}

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
