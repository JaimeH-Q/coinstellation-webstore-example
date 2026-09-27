import React from "react";
import { Heart } from "lucide-react";

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
        <div className="max-w-2xl text-[11px] text-zinc-500 leading-relaxed">
          &copy; {year} {serverName}. Todos los derechos reservados. No afiliado oficialmente ni respaldado por Mojang Studios, Microsoft Corporation o filiales asociadas. Minecraft es una marca registrada de Mojang Synergies AB.
        </div>

        <div className="flex items-center gap-1 text-[11px] text-zinc-500">
          <span>Hecho con</span>
          <Heart className="h-3 w-3 text-rose-500" />
          <span>para la comunidad gamer</span>
        </div>
      </div>
    </footer>
  );
}
