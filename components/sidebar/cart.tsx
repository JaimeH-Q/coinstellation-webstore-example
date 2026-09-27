"use client";

import React from "react";
import { ShoppingBasket, Trash2, Link2, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { CartItem } from "@/types/webstore";
import { CURRENCY_RATES } from "@/data/mock-data";

interface CartProps {
  items: CartItem[];
  selectedCurrency?: string;
  username?: string;
  onRemoveItem?: (index: number) => void;
  onCheckout?: () => void;
  isCheckingOut?: boolean;
}

export function Cart({
  items = [],
  selectedCurrency = "USDC",
  username = "Invitado",
  onRemoveItem,
  onCheckout,
  isCheckingOut = false,
}: CartProps) {
  const rateInfo = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.USDC;
  const totalUSD = items.reduce((sum, item) => sum + item.price, 0);
  const totalConverted = totalUSD * (rateInfo?.ratePerUSD ?? 1);
  
  const formattedTotal = `${totalConverted.toFixed(2)} USDC`;

  const isEmpty = items.length === 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0c0e18]/80 p-5 shadow-xl backdrop-blur-xl transition-all">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="flex items-center gap-2 text-sm font-black text-white">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
            <ShoppingBasket className="h-4 w-4" />
          </div>
          <span>Mi Carrito</span>
        </h3>
        <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-bold text-blue-300 border border-blue-500/30">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Target Player Tag */}
      <div className="mb-3.5 flex items-center justify-between rounded-xl border border-white/5 bg-black/40 px-3 py-2 text-xs">
        <span className="text-zinc-400">Entrega para:</span>
        <span className="font-extrabold text-cyan-300">{username}</span>
      </div>

      {/* Cart Content */}
      {isEmpty ? (
        <div className="my-6 text-center">
          <p className="text-xs text-zinc-500">Tu carrito de compras está vacío.</p>
          <p className="mt-1 text-[11px] text-zinc-600">Selecciona un rango o item para comenzar.</p>
        </div>
      ) : (
        <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
          {items.map((item, index) => {
            const itemPrice = item.price * (rateInfo?.ratePerUSD ?? 1);
            const formattedItemPrice = `${itemPrice.toFixed(2)} USDC`;

            return (
              <div
                key={`${item.id}-${index}`}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5 text-xs transition-colors hover:bg-white/10"
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="font-bold text-white truncate max-w-[150px]">
                    {item.name}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {formattedItemPrice}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem?.(index)}
                  aria-label={`Eliminar ${item.name} del carrito`}
                  className="rounded-lg p-1 text-red-400/80 transition-colors hover:bg-red-500/20 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtotal / Total */}
      <div className="mt-4 border-t border-white/10 pt-3.5">
        <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-white">
          <span>Total a Pagar:</span>
          <span className="text-base font-black text-emerald-400">{formattedTotal}</span>
        </div>
      </div>

      {/* Checkout Button - Generar Link de Pago */}
      <button
        type="button"
        disabled={isEmpty || isCheckingOut}
        onClick={onCheckout}
        className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-transparent disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
      >
        {isCheckingOut ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generando link de pago...</span>
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4 text-white" />
            <span>Generar link de pago</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
        <ShieldCheck className="h-3 w-3 text-emerald-400" />
        <span>Entrega directa por comando en el servidor</span>
      </div>
    </div>
  );
}
