import React from "react";
import { History, Check } from "lucide-react";
import { RecentPurchase } from "@/types/webstore";

interface RecentPurchasesProps {
  purchases?: RecentPurchase[];
}

export function RecentPurchases({ purchases = [] }: RecentPurchasesProps) {
  return (
    <div className="rounded-lg border border-[#2d3139] bg-[#1c1e22] p-5 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        <History className="h-4 w-4 text-[#2b7fff]" />
        <span>Compras Recientes</span>
      </h3>

      <ul className="flex flex-col gap-2">
        {purchases.map((purchase) => (
          <li
            key={purchase.id}
            className="flex items-center gap-2 text-xs text-[#8b949e]"
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-[#2ecc71]" />
            <div>
              <strong className="text-white">{purchase.username}</strong> compró{" "}
              <span className="text-[#e1e4e8]">{purchase.productName}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
