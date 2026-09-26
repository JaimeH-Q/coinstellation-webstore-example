import React from "react";
import { Info, ShieldCheck, Zap, Wallet, CheckCircle2 } from "lucide-react";

interface AboutSectionProps {
  id?: string;
  serverName?: string;
}

export function AboutSection({
  id = "about-section",
  serverName = "CraftNetwork",
}: AboutSectionProps) {
  return (
    <section
      id={id}
      className="rounded-3xl border border-white/10 bg-[#0c0e18]/80 p-6 sm:p-7 shadow-xl backdrop-blur-xl transition-all"
    >
      <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-950/40 text-blue-400">
          <Info className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            Información de Compra & Entrega
          </h2>
          <p className="text-xs text-zinc-400">
            Entregas 100% automatizadas en la red {serverName}.
          </p>
        </div>
      </div>

      <p className="mb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        Bienvenido a la tienda oficial de <strong>{serverName}</strong>. Todos los fondos recaudados se destinan al mantenimiento de los servidores dedicados y desarrollo de nuevas modalidades.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Card 1: Entrega Instantánea */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex flex-col justify-between">
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-300">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>Entrega en Segundos</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              El sistema sincroniza tu compra al instante con el servidor. No necesitas reiniciar el juego.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>100% Automatizado</span>
          </div>
        </div>

        {/* Card 2: Pagos Seguros */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex flex-col justify-between">
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-300">
              <Wallet className="h-4 w-4 text-purple-400" />
              <span>Pagos Seguros</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Aceptamos pagos directos con tarjetas, pasarelas locales y criptomonedas (Solana, USDT, TON, Ethereum) con procesamiento automático.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-purple-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Transacciones Protegidas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
