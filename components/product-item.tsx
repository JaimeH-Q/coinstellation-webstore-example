"use client";

import React from "react";
import { Info, ShoppingCart } from "lucide-react";
import { Product } from "@/types/webstore";

interface ProductItemProps {
  product: Product;
  onOpenInfo?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductItem({
  product,
  onOpenInfo,
  onAddToCart,
}: ProductItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#2d3139] bg-black/20 px-4 py-3.5 transition-colors hover:bg-[#24272d]">
      <div className="flex flex-col">
        <span className="text-sm sm:text-base font-bold text-white">
          {product.name}
        </span>
        <span className="text-xs sm:text-sm font-medium text-[#8b949e]">
          ${product.price.toFixed(2)} USD
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpenInfo?.(product)}
          aria-label={`Ver información de ${product.name}`}
          className="flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-lg bg-[#2d3139] text-[#e1e4e8] transition-colors hover:bg-[#383e48]"
        >
          <Info className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          className="flex h-8.5 cursor-pointer items-center gap-1.5 rounded-lg bg-[#2ecc71] px-3.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#27ae60]"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Comprar</span>
        </button>
      </div>
    </div>
  );
}
