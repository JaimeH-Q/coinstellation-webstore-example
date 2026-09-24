"use client";

import React from "react";
import { NavigationMenu } from "./navigation-menu";
import { Cart } from "./cart";
import { DonorCard } from "./donor-card";
import { RecentPurchases } from "./recent-purchases";
import { CartItem, DonorOfTheMonth, RecentPurchase } from "@/types/webstore";

interface SidebarProps {
  activeSection?: string;
  onNavigate?: (id: string) => void;
  cartItems: CartItem[];
  onRemoveCartItem?: (index: number) => void;
  onCheckout?: () => void;
  donor?: DonorOfTheMonth;
  recentPurchases?: RecentPurchase[];
}

export function Sidebar({
  activeSection,
  onNavigate,
  cartItems,
  onRemoveCartItem,
  onCheckout,
  donor,
  recentPurchases,
}: SidebarProps) {
  return (
    <aside className="flex flex-col gap-5">
      <NavigationMenu activeSection={activeSection} onNavigate={onNavigate} />
      <Cart
        items={cartItems}
        onRemoveItem={onRemoveCartItem}
        onCheckout={onCheckout}
      />
      <DonorCard donor={donor} />
      <RecentPurchases purchases={recentPurchases} />
    </aside>
  );
}

export { NavigationMenu, Cart, DonorCard, RecentPurchases };
