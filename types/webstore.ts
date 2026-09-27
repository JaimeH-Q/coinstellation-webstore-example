export interface Product {
  id: string;
  name: string;
  price: number;
  currency?: string;
  description: string;
  category: "permanent" | "temporary";
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

export interface RecentPurchase {
  id: string;
  username: string;
  productName: string;
  timestamp?: string;
}

export interface DonorOfTheMonth {
  username: string;
  avatarUrl: string;
  message: string;
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
