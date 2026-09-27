"use client";

import React from "react";
import { ArrowLeft, Sparkles } from "lucide-react";

interface TopbarProps {
  selectedCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
  username?: string;
  walletName?: string | null;
  onLoginClick?: () => void;
  mainSiteUrl?: string;
}

export function Topbar({
  selectedCurrency = "USD",
  onCurrencyChange,
  username = "Invitado",
  walletName,
  onLoginClick,
  mainSiteUrl = "#",
}: TopbarProps) {
  const avatarUrl = username !== "Invitado"
    ? `https://mc-heads.net/avatar/${encodeURIComponent(username)}/32`
    : "https://mc-heads.net/avatar/Steve/32";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#090b14]/90 px-4 sm:px-6 py-2.5 backdrop-blur-xl transition-all">
      {/* Left: Main Site */}
      <div className="flex items-center gap-3">
        <a
          href={mainSiteUrl}
          className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-zinc-300 transition-all hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Servidor Principal</span>
        </a>
      </div>

      {/* Right: Currency Selector & Player/Wallet Login */}
      <div className="flex items-center gap-2.5">
        {/* Currency Selector */}
        <div className="relative">
          <select
            value={selectedCurrency}
            onChange={(e) => onCurrencyChange?.(e.target.value)}
            className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#141824] pl-3 pr-8 py-1.5 text-xs sm:text-sm font-bold text-zinc-200 outline-none transition-all hover:border-blue-500/40 focus:border-blue-500 shadow-inner"
          >
            <optgroup label="Monedas Fiat">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="ARS">ARS ($)</option>
            </optgroup>
            <optgroup label="Criptomonedas (10% Bonus)">
              <option value="USDT">USDT (₮ Tether)</option>
              <option value="SOL">SOL (◎ Solana)</option>
              <option value="TON">TON (💎 Telegram)</option>
              <option value="ETH">ETH (Ξ Ethereum)</option>
              <option value="BTC">BTC (₿ Bitcoin)</option>
            </optgroup>
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">
            ▼
          </div>
        </div>

        {/* Player Profile / Wallet Connect Button */}
        <button
          type="button"
          onClick={onLoginClick}
          className="group inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white transition-all hover:border-blue-500/50 hover:from-blue-600/20 hover:to-purple-600/20 shadow-md"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            alt={username}
            width={22}
            height={22}
            className="h-5.5 w-5.5 rounded-md border border-white/20 bg-zinc-800 object-cover shadow-xs"
          />
          <div className="flex flex-col text-left">
            <span className="leading-tight">{username}</span>
            {walletName && (
              <span className="text-[10px] font-medium text-purple-400 leading-none">
                {walletName.split(" ")[0]}
              </span>
            )}
          </div>
          <Sparkles className="h-3.5 w-3.5 text-blue-400 transition-transform group-hover:rotate-12" />
        </button>
      </div>
    </header>
  );
}
