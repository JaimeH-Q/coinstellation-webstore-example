"use client";

import React from "react";
import { NavigationMenu } from "./navigation-menu";
import { Cart } from "./cart";
import { CartItem } from "@/types/webstore";

interface SidebarProps {
  activeSection?: string;
  onNavigate?: (id: string) => void;
  cartItems: CartItem[];
  selectedCurrency?: string;
  username?: string;
  onRemoveCartItem?: (index: number) => void;
  onCheckout?: () => void;
  isCheckingOut?: boolean;
}

export function Sidebar({
  activeSection,
  onNavigate,
  cartItems,
  selectedCurrency = "USD",
  username = "Invitado",
  onRemoveCartItem,
  onCheckout,
  isCheckingOut = false,
}: SidebarProps) {
  return (
    <aside className="flex flex-col gap-5 sticky top-16">
      <Cart
        items={cartItems}
        selectedCurrency={selectedCurrency}
        username={username}
        onRemoveItem={onRemoveCartItem}
        onCheckout={onCheckout}
        isCheckingOut={isCheckingOut}
      />
      <NavigationMenu activeSection={activeSection} onNavigate={onNavigate} />
    </aside>
  );
}

export { NavigationMenu, Cart };
