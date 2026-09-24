import { Product, RecentPurchase, DonorOfTheMonth } from "@/types/webstore";

export const PERMANENT_PRODUCTS: Product[] = [
  {
    id: "vip-perm",
    name: "VIP",
    price: 2.99,
    description: "Acceso a /fly en lobbies, 3 hogares (/sethome), kit VIP cada 24hs y prefijo exclusivo [VIP].",
    category: "permanent",
  },
  {
    id: "vip-plus-perm",
    name: "VIP+",
    price: 5.99,
    description: "Todos los beneficios de VIP más: 5 hogares, acceso al comando /hat y /nick, kit VIP+ diario.",
    category: "permanent",
  },
  {
    id: "elite-perm",
    name: "ELITE",
    price: 9.99,
    description: "El rango más alto. Volar en todas las modalidades, 10 hogares, acceso a /workbench, kit ELITE y llaves misteriosas mensuales.",
    category: "permanent",
  },
];

export const TEMPORARY_PRODUCTS: Product[] = [
  {
    id: "vip-temp-30",
    name: "VIP (30 días)",
    price: 0.99,
    description: "Acceso temporal a /fly en lobbies, 3 hogares (/sethome), kit VIP cada 24hs y prefijo exclusivo [VIP] durante 30 días.",
    category: "temporary",
  },
  {
    id: "vip-plus-temp-30",
    name: "VIP+ (30 días)",
    price: 1.99,
    description: "Todos los beneficios de VIP más: 5 hogares, acceso a /hat y /nick, y kit VIP+ diario durante 30 días.",
    category: "temporary",
  },
  {
    id: "elite-temp-30",
    name: "ELITE (30 días)",
    price: 3.49,
    description: "Volar en todas las modalidades, 10 hogares, acceso a /workbench, kit ELITE y llaves misteriosas durante 30 días.",
    category: "temporary",
  },
];

export const RECENT_PURCHASES: RecentPurchase[] = [
  { id: "1", username: "Alex", productName: "ELITE" },
  { id: "2", username: "Notch", productName: "VIP" },
  { id: "3", username: "Creeper99", productName: "VIP+" },
];

export const DONOR_OF_THE_MONTH: DonorOfTheMonth = {
  username: "Steve",
  avatarUrl: "https://mc-heads.net/avatar/Steve/60",
  message: "¡Gracias por apoyar el servidor!",
};
