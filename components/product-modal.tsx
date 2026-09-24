"use client";

import React, { useEffect } from "react";
import { X, ShoppingCart } from "lucide-react";
import { Product } from "@/types/webstore";

interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductModal({
  isOpen,
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  // Close on Escape key
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-[#2d3139] bg-[#1c1e22] p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 cursor-pointer text-[#8b949e] transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg sm:text-xl font-bold text-white">
          {product.name}
        </h3>

        <p className="mt-1 text-base font-bold text-[#2ecc71]">
          ${product.price.toFixed(2)} USD
        </p>

        <p className="mt-4 mb-6 text-xs sm:text-sm leading-relaxed text-[#8b949e]">
          {product.description}
        </p>

        <button
          type="button"
          onClick={() => {
            onAddToCart?.(product);
            onClose();
          }}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2ecc71] py-3 text-sm font-bold text-white transition-colors hover:bg-[#27ae60]"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Añadir al Carrito</span>
        </button>
      </div>
    </div>
  );
}
