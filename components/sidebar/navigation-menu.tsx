"use client";

import React from "react";
import { Shield, Package, Flame, Zap, Sparkles, Gem, HelpCircle } from "lucide-react";

interface NavigationMenuProps {
  activeSection?: string;
  onNavigate?: (id: string) => void;
}

export function NavigationMenu({
  activeSection = "ranks",
  onNavigate,
}: NavigationMenuProps) {
  const navItems = [
    {
      id: "ranks",
      label: "Rangos VIP & Exclusivos",
      icon: <Shield className="h-4 w-4 text-cyan-400" />,
      badge: "POPULAR",
    },
    {
      id: "crates",
      label: "Llaves & Crates Cósmicas",
      icon: <Package className="h-4 w-4 text-fuchsia-400" />,
      badge: "HOT",
    },
    {
      id: "spawners",
      label: "Spawners & Farmeo SMP",
      icon: <Flame className="h-4 w-4 text-amber-400" />,
      badge: "TOP $",
    },
    {
      id: "boosters",
      label: "Boosters & Battle Pass",
      icon: <Zap className="h-4 w-4 text-emerald-400" />,
    },
    {
      id: "cosmetics",
      label: "Capas Animadas & Auras",
      icon: <Sparkles className="h-4 w-4 text-purple-400" />,
    },
    {
      id: "coins",
      label: "Gemas & Monedas de Red",
      icon: <Gem className="h-4 w-4 text-teal-400" />,
    },
    {
      id: "about-section",
      label: "Información & Soporte",
      icon: <HelpCircle className="h-4 w-4 text-zinc-400" />,
    },
  ];

  return (
    <nav className="rounded-3xl border border-white/10 bg-[#0c0e18]/80 p-3.5 shadow-xl backdrop-blur-xl">
      <div className="mb-2 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-zinc-400">
        Categorías de la Tienda
      </div>
      <ul className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate(item.id);
                  }
                }}
                className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/30 to-purple-600/20 text-white border border-blue-500/40 shadow-md shadow-blue-500/10"
                    : "text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-black text-cyan-300 border border-white/10">
                    {item.badge}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
