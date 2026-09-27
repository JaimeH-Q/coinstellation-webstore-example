import React from "react";
import { Crown, Sparkles, Heart } from "lucide-react";
import { DonorOfTheMonth } from "@/types/webstore";

interface DonorCardProps {
  donor?: DonorOfTheMonth;
}

export function DonorCard({
  donor = {
    username: "Satoshi_Craft",
    avatarUrl: "https://mc-heads.net/avatar/Satoshi/80",
    message: "¡Aportando a la economía Web3 de CraftNetwork! 🚀",
    totalDonated: "0.85 SOL ($125 USD)",
    rankBadge: "NETHERITE GOD",
  },
}: DonorCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-[#0e101a] to-[#0a0c14] p-5 shadow-xl backdrop-blur-xl">
      {/* Background Crown Watermark */}
      <Crown className="pointer-events-none absolute -right-4 -bottom-4 h-28 w-28 text-amber-500/5 rotate-12" />

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-300">
          <Crown className="h-4 w-4 text-amber-400 animate-bounce" />
          <span>Donador Destacado</span>
        </h3>
        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-black text-amber-300 border border-amber-500/30">
          TOP 1
        </span>
      </div>

      {/* Body */}
      <div className="flex items-center gap-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={donor.avatarUrl}
          alt={`Avatar de ${donor.username}`}
          width={48}
          height={48}
          className="h-12 w-12 rounded-xl border-2 border-amber-400/60 bg-zinc-900 object-cover shadow-lg shadow-amber-500/20"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-white">{donor.username}</span>
            <Sparkles className="h-3 w-3 text-amber-400" />
          </div>
          {donor.rankBadge && (
            <span className="text-[10px] font-bold text-purple-400">
              [{donor.rankBadge}]
            </span>
          )}
          {donor.totalDonated && (
            <span className="text-[11px] font-semibold text-emerald-400">
              {donor.totalDonated}
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-[11px] italic text-zinc-400 border-t border-white/5 pt-2.5 flex items-start gap-1">
        <Heart className="h-3 w-3 text-rose-500 shrink-0 mt-0.5" />
        <span>&ldquo;{donor.message}&rdquo;</span>
      </p>
    </div>
  );
}
