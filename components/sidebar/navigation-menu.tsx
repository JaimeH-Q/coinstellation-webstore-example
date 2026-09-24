"use client";

import React from "react";
import { Shield, Clock, HelpCircle } from "lucide-react";

interface NavigationMenuProps {
  activeSection?: string;
  onNavigate?: (id: string) => void;
}

export function NavigationMenu({
  activeSection = "rangos-permanentes",
  onNavigate,
}: NavigationMenuProps) {
  const navItems = [
    {
      id: "rangos-permanentes",
      label: "Rangos permanentes",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: "rangos-temporales",
      label: "Rangos temporales",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: "about-section",
      label: "Información / Ayuda",
      icon: <HelpCircle className="h-4 w-4" />,
    },
  ];

  return (
    <nav className="rounded-lg border border-[#2d3139] bg-[#1c1e22] p-3 shadow-sm">
      <ul className="flex flex-col gap-1">
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
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/10 text-white shadow-xs"
                    : "text-[#8b949e] hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
