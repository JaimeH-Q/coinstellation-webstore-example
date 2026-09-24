import React from "react";
import { Crown } from "lucide-react";
import { DonorOfTheMonth } from "@/types/webstore";

interface DonorCardProps {
  donor?: DonorOfTheMonth;
}

export function DonorCard({
  donor = {
    username: "Steve",
    avatarUrl: "https://mc-heads.net/avatar/Steve/60",
    message: "¡Gracias por apoyar el servidor!",
  },
}: DonorCardProps) {
  return (
    <div className="rounded-lg border border-[#2d3139] bg-[#1c1e22] p-5 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        <Crown className="h-4 w-4 text-amber-400" />
        <span>Donador del Mes</span>
      </h3>

      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={donor.avatarUrl}
          alt={`Avatar de ${donor.username}`}
          width={48}
          height={48}
          className="h-12 w-12 rounded-lg border border-[#2d3139] bg-[#24272d] object-cover"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white">{donor.username}</span>
          <span className="text-xs text-[#8b949e]">{donor.message}</span>
        </div>
      </div>
    </div>
  );
}
