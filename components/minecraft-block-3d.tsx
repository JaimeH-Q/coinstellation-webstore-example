"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

interface MinecraftBlock3DProps {
  type?: "lucky" | "ender" | "netherite" | "diamond";
  size?: number;
}

export function MinecraftBlock3D({ type = "netherite", size = 110 }: MinecraftBlock3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Configuración de texturas y colores según el tipo
  const blockConfig = {
    lucky: {
      front: "bg-amber-400 border-amber-300 text-amber-950 font-black",
      glow: "rgba(245, 158, 11, 0.4)",
      label: "?",
      top: "bg-amber-300",
      accent: "Lucky Crate Web3",
    },
    ender: {
      front: "bg-emerald-950 border-emerald-500/60 text-emerald-400 font-bold",
      glow: "rgba(16, 185, 129, 0.5)",
      label: "◈",
      top: "bg-emerald-900",
      accent: "Ender Crate",
    },
    netherite: {
      front: "bg-[#1f192b] border-[#a855f7]/60 text-[#d8b4fe] font-bold",
      glow: "rgba(168, 85, 247, 0.5)",
      label: "⚡",
      top: "bg-[#2e2344]",
      accent: "Netherite Tier",
    },
    diamond: {
      front: "bg-cyan-950 border-cyan-400/80 text-cyan-300 font-bold",
      glow: "rgba(0, 240, 255, 0.5)",
      label: "💎",
      top: "bg-cyan-900",
      accent: "Diamond Tier",
    },
  }[type];

  const halfSize = size / 2;

  return (
    <div
      className="relative flex flex-col items-center justify-center p-4 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Halo de luz de fondo */}
      <div
        className="absolute h-32 w-32 rounded-full blur-2xl transition-all duration-500 pointer-events-none"
        style={{
          backgroundColor: blockConfig.glow,
          transform: isHovered ? "scale(1.3)" : "scale(1)",
        }}
      />

      {/* Escena 3D */}
      <div
        className="mc-block-3d-scene relative flex items-center justify-center"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <div
          className={`mc-block-rotating relative h-full w-full transition-transform duration-300 ${
            isHovered ? "scale-105" : ""
          }`}
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          {/* Front Face */}
          <div
            className={`absolute flex items-center justify-center border-2 shadow-inner select-none mc-enchanted-foil ${blockConfig.front}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `translateZ(${halfSize}px)`,
            }}
          >
            <span className="text-3xl font-black drop-shadow-md">{blockConfig.label}</span>
          </div>

          {/* Back Face */}
          <div
            className={`absolute flex items-center justify-center border-2 select-none mc-enchanted-foil ${blockConfig.front}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(180deg) translateZ(${halfSize}px)`,
            }}
          >
            <span className="text-3xl font-black drop-shadow-md">{blockConfig.label}</span>
          </div>

          {/* Right Face */}
          <div
            className={`absolute flex items-center justify-center border-2 select-none mc-enchanted-foil ${blockConfig.front}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(90deg) translateZ(${halfSize}px)`,
            }}
          >
            <Sparkles className="h-6 w-6 opacity-70" />
          </div>

          {/* Left Face */}
          <div
            className={`absolute flex items-center justify-center border-2 select-none mc-enchanted-foil ${blockConfig.front}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
            }}
          >
            <Sparkles className="h-6 w-6 opacity-70" />
          </div>

          {/* Top Face */}
          <div
            className={`absolute border-2 ${blockConfig.top} border-white/20 select-none mc-enchanted-foil`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateX(90deg) translateZ(${halfSize}px)`,
            }}
          />

          {/* Bottom Face */}
          <div
            className="absolute border-2 bg-black/80 border-black select-none"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
            }}
          />
        </div>
      </div>

      {/* Sombra proyectada */}
      <div className="mt-4 h-3 w-20 rounded-full bg-black/60 blur-xs transition-all duration-300 group-hover:w-24 group-hover:opacity-40" />
    </div>
  );
}
