"use client";

import React, { useState } from "react";
import { Box, Check, Sparkles } from "lucide-react";
import { MinecraftBlock3D } from "./minecraft-block-3d";

interface HeaderBannerProps {
  title?: string;
  serverIp?: string;
}

export function HeaderBanner({
  title = "CRAFTNETWORK",
  serverIp = "PLAY.CRAFTNETWORK.NET",
}: HeaderBannerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyIp = async () => {
    try {
      await navigator.clipboard.writeText(serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(`IP del servidor: ${serverIp}`);
    }
  };

  return (
    <section className="relative overflow-hidden px-4 sm:px-6 pt-10 pb-8 text-center">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-80 w-[600px] rounded-full bg-gradient-to-tr from-purple-600/15 via-blue-500/15 to-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        {/* Contenedor del Título con los Cuadritos de Minecraft ALREDEDOR */}
        <div className="relative flex items-center justify-center py-4">
          {/* Cuadrito 3D Izquierdo (Flotando al lado izquierdo del nombre) */}
          <div className="hidden md:flex absolute -left-4 lg:left-4 top-1/2 -translate-y-1/2 pointer-events-auto">
            <div className="animate-mc-float">
              <MinecraftBlock3D type="diamond" size={64} />
            </div>
          </div>

          {/* Cuadrito 3D Derecho (Flotando al lado derecho del nombre) */}
          <div className="hidden md:flex absolute -right-4 lg:right-4 top-1/2 -translate-y-1/2 pointer-events-auto">
            <div className="animate-mc-float-delayed">
              <MinecraftBlock3D type="netherite" size={64} />
            </div>
          </div>

          {/* Título Central Totalmente Despejado y Legible */}
          <div className="relative z-10 max-w-2xl px-2 sm:px-8">
            {/* Pequeños cubos decorativos en las esquinas superiores */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-xs bg-cyan-400 shadow-sm shadow-cyan-400 animate-pulse" />
              <div className="h-1.5 w-1.5 rounded-xs bg-purple-400 shadow-sm shadow-purple-400" />
              <div className="h-2 w-2 rounded-xs bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
            </div>

            <h1 className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-4xl sm:text-5xl md:text-6xl font-black tracking-wider text-transparent drop-shadow-md">
              {title}
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Adquiere rangos exclusivos, llaves cósmicas, spawners de economía y multiplicadores con entrega automática en segundos.
            </p>
          </div>
        </div>

        {/* Server IP Button Único y Centrado */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleCopyIp}
            className="group flex cursor-pointer items-center gap-3.5 rounded-2xl border border-white/10 bg-[#121524]/85 px-6 py-3.5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/10 backdrop-blur-md"
            title="Click para copiar IP"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/50 text-cyan-400 transition-all group-hover:scale-105 group-hover:bg-cyan-500 group-hover:text-black">
              {copied ? <Check className="h-5 w-5 text-emerald-400 group-hover:text-black" /> : <Box className="h-5 w-5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white">
                {serverIp}
              </span>
              <span className="text-[11px] font-bold text-zinc-400 group-hover:text-cyan-300">
                {copied ? "¡COPIADO AL PORTAPAPELES! 🚀" : "CLICK PARA COPIAR IP DE MINECRAFT"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
