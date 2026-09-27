"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Trophy, RotateCcw, Package } from "lucide-react";
import { Product } from "@/types/webstore";

interface CrateSimulatorModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

const POSSIBLE_REWARDS = [
  { name: "Armadura Netherite Protection V", tier: "MÍTICO", color: "text-rose-400 border-rose-500/50 bg-rose-950/40", icon: "👑" },
  { name: "Espada 'Cósmica' Filo VI", tier: "LEGENDARIO", color: "text-amber-400 border-amber-500/50 bg-amber-950/40", icon: "⚡" },
  { name: "Spawner de Iron Golem x2", tier: "LEGENDARIO", color: "text-amber-400 border-amber-500/50 bg-amber-950/40", icon: "🤖" },
  { name: "10,000 Gemas de Red + /fly 30d", tier: "ÉPICO", color: "text-purple-400 border-purple-500/50 bg-purple-950/40", icon: "💎" },
  { name: "Pack 64 Manzanas de Notch (GOD)", tier: "RARO", color: "text-cyan-400 border-cyan-500/50 bg-cyan-950/40", icon: "🍏" },
  { name: "Booster Global x3 XP (2 Horas)", tier: "RARO", color: "text-cyan-400 border-cyan-500/50 bg-cyan-950/40", icon: "🚀" },
];

export function CrateSimulatorModal({ isOpen, product, onClose }: CrateSimulatorModalProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonReward, setWonReward] = useState<typeof POSSIBLE_REWARDS[0] | null>(null);
  const [spinIndex, setSpinIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setIsSpinning(false);
      setWonReward(null);
      setSpinIndex(0);
    }
  }, [isOpen]);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonReward(null);

    let counter = 0;
    const totalTicks = 28;
    const interval = setInterval(() => {
      setSpinIndex((prev) => (prev + 1) % POSSIBLE_REWARDS.length);
      counter++;

      if (counter >= totalTicks) {
        clearInterval(interval);
        const finalReward = POSSIBLE_REWARDS[Math.floor(Math.random() * POSSIBLE_REWARDS.length)];
        setWonReward(finalReward);
        setIsSpinning(false);
      }
    }, 90);
  };

  if (!isOpen || !product) return null;

  const currentHighlight = POSSIBLE_REWARDS[spinIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-purple-500/40 bg-[#0e101a] p-6 shadow-2xl shadow-purple-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg bg-white/5 p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/60 text-purple-400 mc-enchanted-foil">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Simulador: {product.name}</span>
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                CRATE PREVIEW
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Prueba la animación de apertura y conoce los premios legendarios.
            </p>
          </div>
        </div>

        {/* Animated Roulette Box */}
        <div className="my-6 flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-black/60 p-6 relative overflow-hidden">
          {/* Target Pointer */}
          <div className="absolute top-1 z-20 flex flex-col items-center">
            <div className="h-0 w-0 border-x-6 border-x-transparent border-t-8 border-t-amber-400 drop-shadow-md" />
          </div>

          <div
            className={`w-full max-w-sm rounded-xl border-2 p-5 text-center transition-all duration-150 mc-enchanted-foil ${
              wonReward ? wonReward.color : currentHighlight.color
            }`}
          >
            <div className="text-4xl mb-2 animate-bounce">
              {wonReward ? wonReward.icon : currentHighlight.icon}
            </div>
            <span className="text-[10px] font-extrabold tracking-widest uppercase">
              {wonReward ? wonReward.tier : currentHighlight.tier}
            </span>
            <h4 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
              {wonReward ? wonReward.name : currentHighlight.name}
            </h4>
          </div>

          {wonReward && (
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400 animate-pulse">
              <Trophy className="h-4 w-4" />
              <span>¡PREMIO DEMO DESBLOQUEADO! (Este item caerá en tu cuenta al comprar)</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpin}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSpinning ? (
              <>
                <RotateCcw className="h-4 w-4 animate-spin" />
                <span>Girando Crate...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>{wonReward ? "Girar de Nuevo" : "Probar Apertura Gratis"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
