"use client";

import React from "react";
import { ArrowLeft, Sparkles, Coins } from "lucide-react";

interface TopbarProps {
  selectedCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
  username?: string;
  onLoginClick?: () => void;
  mainSiteUrl?: string;
}

export function Topbar({
  selectedCurrency = "USDC",
  username = "Invitado",
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

      {/* Right: Fixed Currency Badge & Player Profile */}
      <div className="flex items-center gap-2.5">
        {/* Currency Indicator (USDC only) */}
        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs sm:text-sm font-bold text-emerald-300 shadow-inner">
          <Coins className="h-3.5 w-3.5 text-emerald-400" />
          <span>USDC</span>
        </div>

        {/* Player Profile Button */}
        <button
          type="button"
          onClick={onLoginClick}
          className="group inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white transition-all hover:border-blue-500/50 hover:from-blue-600/20 hover:to-purple-600/20 shadow-md cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            alt={username}
            width={22}
            height={22}
            className="h-5.5 w-5.5 rounded-md border border-white/20 bg-zinc-800 object-cover shadow-xs"
          />
          <span className="leading-tight">{username}</span>
          <Sparkles className="h-3.5 w-3.5 text-blue-400 transition-transform group-hover:rotate-12" />
        </button>
      </div>
    </header>
  );
}
