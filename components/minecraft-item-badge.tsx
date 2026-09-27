"use client";

import React from "react";
import { Sparkles, Shield, Key, Package, Zap, Gem, Flame, Crown } from "lucide-react";
import { RarityType } from "@/types/webstore";

interface MinecraftItemBadgeProps {
  type?: string;
  rarity?: RarityType;
  size?: "sm" | "md" | "lg";
  isEnchanted?: boolean;
}

export function MinecraftItemBadge({
  type = "sword",
  rarity = "rare",
  size = "md",
  isEnchanted = true,
}: MinecraftItemBadgeProps) {
  const sizeClasses = {
    sm: "h-10 w-10 text-xs",
    md: "h-14 w-14 text-sm",
    lg: "h-20 w-20 text-base",
  }[size];

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  }[size];

  const rarityBorders: Record<RarityType, { border: string; bg: string; glow: string; iconColor: string }> = {
    common: {
      border: "border-zinc-600/60",
      bg: "bg-zinc-900/80",
      glow: "shadow-zinc-500/10",
      iconColor: "text-zinc-300",
    },
    rare: {
      border: "border-cyan-500/50",
      bg: "bg-cyan-950/40",
      glow: "shadow-cyan-500/20",
      iconColor: "text-cyan-300",
    },
    epic: {
      border: "border-purple-500/60",
      bg: "bg-purple-950/40",
      glow: "shadow-purple-500/25",
      iconColor: "text-purple-300",
    },
    legendary: {
      border: "border-amber-500/70",
      bg: "bg-amber-950/40",
      glow: "shadow-amber-500/30",
      iconColor: "text-amber-300",
    },
    mythic: {
      border: "border-rose-500/80",
      bg: "bg-rose-950/50",
      glow: "shadow-rose-500/40",
      iconColor: "text-rose-300",
    },
  };

  const style = rarityBorders[rarity] || rarityBorders.rare;

  const renderIcon = () => {
    switch (type) {
      case "sword":
        return <Shield className={`${iconSizes} ${style.iconColor}`} />;
      case "crown":
      case "helmet":
        return <Crown className={`${iconSizes} ${style.iconColor}`} />;
      case "crate":
        return <Package className={`${iconSizes} ${style.iconColor}`} />;
      case "key":
        return <Key className={`${iconSizes} ${style.iconColor}`} />;
      case "spawner":
        return <Flame className={`${iconSizes} ${style.iconColor}`} />;
      case "wings":
      case "dragon":
        return <Sparkles className={`${iconSizes} ${style.iconColor}`} />;
      case "booster":
        return <Zap className={`${iconSizes} ${style.iconColor}`} />;
      case "gem":
        return <Gem className={`${iconSizes} ${style.iconColor}`} />;
      default:
        return <Sparkles className={`${iconSizes} ${style.iconColor}`} />;
    }
  };

  return (
    <div
      className={`relative flex ${sizeClasses} shrink-0 items-center justify-center rounded-xl border ${style.border} ${style.bg} ${
        isEnchanted ? "mc-enchanted-foil" : ""
      } shadow-lg ${style.glow} transition-all duration-300 hover:scale-105`}
    >
      {/* Corner Pixel accents */}
      <div className="absolute top-0.5 left-0.5 h-1 w-1 bg-white/40" />
      <div className="absolute top-0.5 right-0.5 h-1 w-1 bg-white/40" />
      <div className="absolute bottom-0.5 left-0.5 h-1 w-1 bg-white/40" />
      <div className="absolute bottom-0.5 right-0.5 h-1 w-1 bg-white/40" />

      {/* Item Icon */}
      <div className="relative z-10 animate-mc-float">
        {renderIcon()}
      </div>
    </div>
  );
}
