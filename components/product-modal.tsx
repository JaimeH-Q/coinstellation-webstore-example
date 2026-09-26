"use client";

import React, { useEffect } from "react";
import { X, ShoppingCart, Check, Zap, Sparkles, Shield } from "lucide-react";
import { Product } from "@/types/webstore";
import { MinecraftItemBadge } from "./minecraft-item-badge";
import { CRYPTO_RATES } from "@/data/mock-data";

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  selectedCurrency?: string;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductModal({
  isOpen,
  product,
  selectedCurrency = "USD",
  onClose,
  onAddToCart,
}: ProductModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const rateInfo = CRYPTO_RATES[selectedCurrency] || CRYPTO_RATES.USD;
  const convertedPrice = product.price * rateInfo.ratePerUSD;
  const formattedPrice = rateInfo.isCrypto
    ? `${convertedPrice.toFixed(rateInfo.symbol === "BTC" ? 6 : rateInfo.symbol === "ETH" ? 5 : rateInfo.symbol === "SOL" ? 3 : 2)} ${rateInfo.symbol}`
    : `${rateInfo.icon}${convertedPrice.toFixed(2)} ${rateInfo.symbol}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0e101c] p-6 sm:p-7 shadow-2xl shadow-blue-500/10 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-5 right-5 rounded-xl bg-white/5 p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with Minecraft Item */}
        <div className="flex items-center gap-4">
          <MinecraftItemBadge
            type={product.minecraftIcon || "sword"}
            rarity={product.rarity || "rare"}
            size="lg"
            isEnchanted={true}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-blue-300 border border-blue-500/30">
                {product.rarity || "LEGENDARIO"}
              </span>
              {product.badge && (
                <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-purple-300 border border-purple-500/30">
                  {product.badge}
                </span>
              )}
            </div>
            <h3 className="mt-1 text-xl sm:text-2xl font-black text-white">
              {product.name}
            </h3>
            <p className="text-lg font-black text-emerald-400">
              {formattedPrice}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-300">
          {product.description}
        </p>

        {/* Features Checklist */}
        {product.features && product.features.length > 0 && (
          <div className="mt-4 rounded-2xl border border-white/5 bg-black/40 p-4">
            <h4 className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              <span>Beneficios y Comandos Incluidos:</span>
            </h4>
            <ul className="space-y-2">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-200">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Crypto Perks Info Box */}
        {product.cryptoBonusAmount && (
          <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-purple-500/30 bg-purple-950/30 p-3.5 text-xs text-purple-200">
            <Zap className="h-4 w-4 shrink-0 text-amber-400 animate-pulse" />
            <div>
              <strong className="text-white">Ventaja Web3 / Cripto:</strong>{" "}
              {product.cryptoBonusAmount} al pagar con Solana, USDT o ETH.
            </div>
          </div>
        )}

        {/* Add to Cart CTA */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => {
              onAddToCart?.(product);
              onClose();
            }}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Añadir al Carrito ({formattedPrice})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
