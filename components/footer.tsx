import React from "react";

interface FooterProps {
  serverName?: string;
  year?: number;
}

export function Footer({
  serverName = "CraftNetwork",
  year = 2026,
}: FooterProps) {
  return (
    <footer className="mt-12 border-t border-[#2d3139]/50 py-8 text-center text-xs text-[#8b949e]">
      <p>
        &copy; {year} {serverName}. Todos los derechos reservados. No afiliado
        oficialmente con Mojang Studios ni Microsoft.
      </p>
    </footer>
  );
}
