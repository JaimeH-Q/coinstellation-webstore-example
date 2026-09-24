"use client";

import React from "react";
import { ShoppingBasket, Trash2, Loader2 } from "lucide-react";
import { CartItem } from "@/types/webstore";

interface CartProps {
  items: CartItem[];
  onRemoveItem?: (index: number) => void;
  onCheckout?: () => void;
  isCheckingOut?: boolean;
}

export function Cart({
  items = [],
  onRemoveItem,
  onCheckout,
  isCheckingOut = false,
}: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const isEmpty = items.length === 0;

  return (
    <div className="rounded-lg border border-[#2d3139] bg-[#1c1e22] p-5 shadow-sm">
      <h3 className="mb-3.5 flex items-center gap-2 text-sm font-semibold text-white">
        <ShoppingBasket className="h-4 w-4 text-[#2b7fff]" />
        <span>Carrito</span>
      </h3>

      {isEmpty ? (
        <p className="my-3 text-xs text-[#8b949e]">Tu carrito está vacío.</p>
      ) : (
        <div className="flex max-h-60 flex-col gap-2 overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center justify-between border-b border-[#2d3139] pb-2 text-xs"
            >
              <span className="font-medium text-[#e1e4e8] truncate max-w-[140px]">
                {item.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#8b949e] font-semibold">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveItem?.(index)}
                  aria-label={`Eliminar ${item.name} del carrito`}
                  className="cursor-pointer text-[#e74c3c] transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-[#2d3139] pt-3 text-xs sm:text-sm font-bold text-white">
        <span>Total:</span>
        <span className="text-[#2ecc71]">${total.toFixed(2)} USD</span>
      </div>

      <button
        type="button"
        disabled={isEmpty || isCheckingOut}
        onClick={onCheckout}
        className="mt-3.5 flex w-full items-center justify-center gap-2 cursor-pointer rounded-lg bg-[#2b7fff] py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#1a62d6] disabled:cursor-not-allowed disabled:bg-[#2d3139] disabled:text-[#8b949e]"
      >
        {isCheckingOut ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generando Pago...</span>
          </>
        ) : (
          <span>Procesar Pago</span>
        )}
      </button>
    </div>
  );
}
