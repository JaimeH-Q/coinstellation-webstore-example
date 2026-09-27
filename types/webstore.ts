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

/** Datos de un cobro creado en Coinstellation, listos para mostrar al comprador. */
export interface PaymentDetails {
  /** ID del pago en Coinstellation (se usa para consultar su estado). */
  id: string;
  /** Monto exacto a pagar, definido por el paquete en Coinstellation. */
  amount: string;
  /** Activo del pago: "XLM" o "USDC". */
  asset: string;
  /** Wallet que recibe el pago. */
  destination: string;
  /** MEMO_ID obligatorio: identifica este pago en la blockchain. */
  memo: string;
  /** Enlace SEP-7 (web+stellar:pay?...) con destino, monto, activo y memo. */
  uri: string;
  /** QR del enlace de pago (data URL). */
  qr: string;
}
