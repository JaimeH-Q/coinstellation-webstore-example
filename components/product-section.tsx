"use client";

import React from "react";
import { Product } from "@/types/webstore";
import { ProductItem } from "./product-item";

interface ProductSectionProps {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  products: Product[];
  onOpenInfo?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductSection({
  id,
  title,
  icon,
  products,
  onOpenInfo,
  onAddToCart,
}: ProductSectionProps) {
  return (
    <section
      id={id}
      className="rounded-lg border border-[#2d3139] bg-[#1c1e22] p-5 shadow-sm"
    >
      <h2 className="mb-4 flex items-center gap-2.5 border-b border-[#2d3139] pb-2.5 text-base font-semibold text-white">
        {icon}
        <span>{title}</span>
      </h2>

      <div className="flex flex-col gap-2.5">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onOpenInfo={onOpenInfo}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}
