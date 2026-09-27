import React from "react";
import { History, CheckCircle2 } from "lucide-react";
import { RecentPurchase } from "@/types/webstore";

interface RecentPurchasesProps {
  purchases?: RecentPurchase[];
}

export function RecentPurchases({ purchases = [] }: RecentPurchasesProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0c0e18]/80 p-5 shadow-xl backdrop-blur-xl transition-all">
      {/* Header */}
      <div className="mb-3.5 flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="flex items-center gap-2 text-sm font-black text-white">
          <History className="h-4 w-4 text-blue-400" />
          <span>Compras en Vivo</span>
        </h3>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          EN VIVO
        </span>
      </div>

      {/* List */}
      <ul className="flex flex-col gap-2.5">
        {purchases.map((purchase) => {
          const avatarUrl =
            purchase.avatarUrl ||
            `https://mc-heads.net/avatar/${encodeURIComponent(purchase.username)}/32`;

          return (
            <li
              key={purchase.id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2 text-xs transition-colors hover:bg-white/10"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt={purchase.username}
                  width={28}
                  height={28}
                  className="h-7 w-7 shrink-0 rounded-lg border border-white/15 bg-zinc-900 object-cover"
                />
                <div className="min-w-0">
                  <div className="truncate font-bold text-white text-[11px] sm:text-xs">
                    {purchase.username}
                  </div>
                  <div className="truncate text-[10px] text-cyan-300 font-medium">
                    {purchase.productName}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
