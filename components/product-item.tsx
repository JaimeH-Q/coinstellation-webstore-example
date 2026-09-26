"use client";

import React from "react";
import { Info, ShoppingCart, Sparkles, Check, Package, Zap } from "lucide-react";
import { Product } from "@/types/webstore";
import { MinecraftItemBadge } from "./minecraft-item-badge";
import { CRYPTO_RATES } from "@/data/mock-data";

interface ProductItemProps {
  product: Product;
  selectedCurrency?: string;
  onOpenInfo?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onOpenCrateDemo?: (product: Product) => void;
}

export function ProductItem({
  product,
  selectedCurrency = "USD",
  onOpenInfo,
  onAddToCart,
  onOpenCrateDemo,
}: ProductItemProps) {
  const rateInfo = CRYPTO_RATES[selectedCurrency] || CRYPTO_RATES.USD;
  const convertedPrice = (product.price * rateInfo.ratePerUSD);
  
  const formattedPrice = rateInfo.isCrypto
    ? `${convertedPrice.toFixed(rateInfo.symbol === "BTC" ? 6 : rateInfo.symbol === "ETH" ? 5 : rateInfo.symbol === "SOL" ? 3 : 2)} ${rateInfo.symbol}`
    : `${rateInfo.icon}${convertedPrice.toFixed(2)} ${rateInfo.symbol}`;

  const isCrate = product.category === "crates" || product.minecraftIcon === "crate" || product.minecraftIcon === "key";

  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#101320]/80 p-4 transition-all duration-300 hover:border-blue-500/40 hover:bg-[#15192c]/90 hover:shadow-xl hover:shadow-blue-500/5 backdrop-blur-md">
      {/* Best Seller / Hot Badge */}
      {product.badge && (
        <div className="absolute -top-2.5 right-4 z-10">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-sm ${product.badgeColor || "bg-blue-500/20 text-blue-300 border-blue-500/40"}`}>
            {product.badge}
          </span>
        </div>
      )}

      {/* Left: Minecraft Icon & Product Details */}
      <div className="flex items-start sm:items-center gap-3.5 flex-1">
        <MinecraftItemBadge
          type={product.minecraftIcon || "sword"}
          rarity={product.rarity || "rare"}
          size="md"
          isEnchanted={product.rarity === "legendary" || product.rarity === "mythic"}
        />

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
              {product.name}
            </span>
          </div>

          <p className="line-clamp-1 text-xs text-zinc-400 mt-0.5 max-w-md">
            {product.description}
          </p>

          {/* Quick Perks / Features Pills */}
          {product.features && product.features.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {product.features.slice(0, 2).map((feat, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-300 border border-white/5"
                >
                  <Check className="h-3 w-3 text-emerald-400" />
                  {feat}
                </span>
              ))}
              {product.features.length > 2 && (
                <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400">
                  +{product.features.length - 2} más
                </span>
              )}
            </div>
          )}

          {/* Crypto Bonus Tag */}
          {product.cryptoBonusAmount && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-purple-300">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Crypto Bonus: {product.cryptoBonusAmount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Price & Buttons */}
      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t border-white/5 sm:border-0">
        <div className="flex flex-col sm:items-end">
          {product.originalPrice && (
            <span className="text-[11px] text-zinc-500 line-through">
              ${product.originalPrice.toFixed(2)} USD
            </span>
          )}
          <span className="text-base sm:text-lg font-black text-emerald-400 tracking-tight">
            {formattedPrice}
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">Entrega Automática</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Crate Opening Demo Simulator (if applicable) */}
          {isCrate && onOpenCrateDemo && (
            <button
              type="button"
              onClick={() => onOpenCrateDemo(product)}
              title="Probar simulador de apertura"
              className="flex h-9 items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 px-2.5 text-xs font-bold text-purple-300 transition-all hover:bg-purple-900/60 hover:text-white"
            >
              <Package className="h-4 w-4" />
              <span className="hidden md:inline">Demo</span>
            </button>
          )}

          {/* Info Modal Button */}
          <button
            type="button"
            onClick={() => onOpenInfo?.(product)}
            aria-label={`Ver detalles de ${product.name}`}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <Info className="h-4 w-4" />
          </button>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
