import React from "react";
import { Shield, Sparkles, Heart } from "lucide-react";

interface FooterProps {
  serverName?: string;
  year?: number;
}

export function Footer({
  serverName = "CraftNetwork",
  year = 2026,
}: FooterProps) {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#07080e] py-12 text-center text-xs text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 flex flex-col items-center gap-6">
        {/* Payment Badges Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-zinc-400">
          <span className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1">💳 Visa / Mastercard</span>
          <span className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1">🅿️ PayPal</span>
          <span className="rounded-lg border border-purple-500/30 bg-purple-950/30 px-2.5 py-1 text-purple-300">◎ Solana</span>
          <span className="rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1 text-cyan-300">💎 TON Network</span>
          <span className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-emerald-300">₮ Tether (USDT)</span>
          <span className="rounded-lg border border-blue-500/30 bg-blue-950/30 px-2.5 py-1 text-blue-300">Ξ Ethereum</span>
          <span className="rounded-lg border border-amber-500/30 bg-amber-950/30 px-2.5 py-1 text-amber-300">₿ Bitcoin</span>
        </div>

        <div className="max-w-2xl text-[11px] text-zinc-500 leading-relaxed">
          &copy; {year} {serverName}. Todos los derechos reservados. No afiliado oficialmente ni respaldado por Mojang Studios, Microsoft Corporation o filiales asociadas. Minecraft es una marca registrada de Mojang Synergies AB.
        </div>

        <div className="flex items-center gap-1 text-[11px] text-zinc-500">
          <span>Hecho con</span>
          <Heart className="h-3 w-3 text-rose-500" />
          <span>para la comunidad gamer y Web3</span>
        </div>
      </div>
    </footer>
  );
}
