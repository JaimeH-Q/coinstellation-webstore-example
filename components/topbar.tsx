"use client";

import React from "react";
import { ArrowLeft, User } from "lucide-react";

interface TopbarProps {
  selectedCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
  username?: string;
  onLoginClick?: () => void;
  mainSiteUrl?: string;
}

export function Topbar({
  selectedCurrency = "USD",
  onCurrencyChange,
  username = "Invitado",
  onLoginClick,
  mainSiteUrl = "#",
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#2d3139] bg-[#121316]/95 px-5 py-2.5 backdrop-blur-sm">
      <a
        href={mainSiteUrl}
        className="inline-flex items-center gap-2 rounded-lg border border-[#2d3139] bg-[#24272d] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#e1e4e8] transition-colors hover:bg-[#2d3139]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Sitio Principal</span>
      </a>

      <div className="flex items-center gap-2.5">
        <select
          value={selectedCurrency}
          onChange={(e) => onCurrencyChange?.(e.target.value)}
          className="cursor-pointer rounded-lg border border-[#2d3139] bg-[#24272d] px-2.5 py-1.5 text-xs sm:text-sm text-[#e1e4e8] outline-none transition-colors hover:border-[#383e48]"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="ARS">ARS ($)</option>
        </select>

        <button
          type="button"
          onClick={onLoginClick}
          className="inline-flex items-center gap-2 rounded-lg border border-[#2d3139] bg-[#24272d] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#e1e4e8] transition-colors hover:bg-[#2d3139]"
        >
          <span>{username}</span>
          <User className="h-4 w-4 text-[#8b949e]" />
        </button>
      </div>
    </header>
  );
}
