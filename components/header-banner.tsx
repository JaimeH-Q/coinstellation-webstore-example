"use client";

import React, { useState } from "react";
import { Box, MessageSquare, Check, Copy } from "lucide-react";

interface HeaderBannerProps {
  title?: string;
  subtitle?: string;
  serverIp?: string;
  discordUrl?: string;
  discordHandle?: string;
}

export function HeaderBanner({
  title = "CRAFTNETWORK",
  subtitle = "TIENDA OFICIAL",
  serverIp = "PLAY.CRAFTNETWORK.NET",
  discordUrl = "https://discord.gg/craft",
  discordHandle = "DISCORD.GG/CRAFT",
}: HeaderBannerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyIp = async () => {
    try {
      await navigator.clipboard.writeText(serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      alert(`IP del servidor: ${serverIp}`);
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#2b7fff]/10 via-[#121316]/50 to-transparent px-5 pt-12 pb-8 text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-widest text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mt-1 text-xs font-semibold tracking-[0.25em] text-[#8b949e] uppercase">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Box Copiar IP */}
        <button
          type="button"
          onClick={handleCopyIp}
          className="group flex cursor-pointer items-center gap-3.5 rounded-lg border border-[#2d3139] bg-[#1c1e22] px-5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2b7fff] hover:shadow-lg hover:shadow-[#2b7fff]/5"
          title="Click para copiar IP"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2b7fff]/10 text-[#2b7fff] transition-colors group-hover:bg-[#2b7fff] group-hover:text-white">
            {copied ? <Check className="h-5 w-5 text-green-400" /> : <Box className="h-5 w-5" />}
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold tracking-wide text-white">
              {serverIp}
            </span>
            <span className="text-[11px] font-medium text-[#8b949e] group-hover:text-[#2b7fff]">
              {copied ? "¡COPIADO AL PORTAPAPELES!" : "HAZ CLICK PARA COPIAR IP"}
            </span>
          </div>
        </button>

        {/* Box Discord */}
        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3.5 rounded-lg border border-[#2d3139] bg-[#1c1e22] px-5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5865F2] hover:shadow-lg hover:shadow-[#5865F2]/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5865F2]/10 text-[#5865F2] transition-colors group-hover:bg-[#5865F2] group-hover:text-white">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold tracking-wide text-white">
              {discordHandle}
            </span>
            <span className="text-[11px] font-medium text-[#8b949e] group-hover:text-[#5865F2]">
              COMUNIDAD OFICIAL
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
