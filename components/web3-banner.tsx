"use client";

import React from "react";
import { Zap, ShieldCheck, Coins, Sparkles, Activity } from "lucide-react";

export function Web3Banner() {
  return (
    <div className="border-b border-white/5 bg-gradient-to-r from-purple-950/40 via-blue-950/40 to-emerald-950/40 backdrop-blur-md px-4 py-2">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Server Live Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white tracking-wide">1,420 ONLINE</span>
            <span className="text-[11px] text-zinc-400">| 20.0 TPS Sólido</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-zinc-300">
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span>Temporada 5: Nether On-Chain</span>
          </div>
        </div>

        {/* Right: Web3 & Crypto Perks */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-purple-500/15 px-2.5 py-0.5 border border-purple-500/30 text-purple-300 font-semibold">
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span>Crypto Promo: +10% Gemas Gratis</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1 text-zinc-300">
              <Coins className="h-3 w-3 text-amber-400" /> SOL, TON, USDT, ETH
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="h-3 w-3" /> Entrega Instantánea 3s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
