"use client";

import React from "react";
import { Product } from "@/types/webstore";
import { ProductItem } from "./product-item";

interface ProductSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  products: Product[];
  selectedCurrency?: string;
  onOpenInfo?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onOpenCrateDemo?: (product: Product) => void;
}

export function ProductSection({
  id,
  title,
  subtitle,
  icon,
  products,
  selectedCurrency = "USD",
  onOpenInfo,
  onAddToCart,
  onOpenCrateDemo,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section
      id={id}
      className="rounded-3xl border border-white/10 bg-[#0c0e18]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all"
    >
      {/* Section Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-950/40 text-blue-400">
            {icon}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>{title}</span>
            </h2>
            {subtitle && (
              <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-400 border border-white/5">
          {products.length} {products.length === 1 ? "artículo" : "artículos"}
        </span>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-3.5">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            selectedCurrency={selectedCurrency}
            onOpenInfo={onOpenInfo}
            onAddToCart={onAddToCart}
            onOpenCrateDemo={onOpenCrateDemo}
          />
        ))}
      </div>
    </section>
  );
}
