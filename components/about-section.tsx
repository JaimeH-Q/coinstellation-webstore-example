import React from "react";
import { Info, Headphones, ShieldAlert } from "lucide-react";

interface AboutSectionProps {
  id?: string;
  serverName?: string;
}

export function AboutSection({
  id = "about-section",
  serverName = "CraftNetwork",
}: AboutSectionProps) {
  return (
    <section
      id={id}
      className="rounded-lg border border-[#2d3139] bg-[#1c1e22] p-5 shadow-sm"
    >
      <h2 className="mb-4 flex items-center gap-2.5 border-b border-[#2d3139] pb-2.5 text-base font-semibold text-white">
        <Info className="h-4 w-4 text-[#2b7fff]" />
        <span>Información de Compras</span>
      </h2>

      <p className="mb-5 text-xs sm:text-sm text-[#8b949e]">
        Bienvenido a la tienda oficial de {serverName}. Aquí puedes adquirir rangos
        y mejoras para apoyar el servidor. Todas las compras son procesadas de
        forma segura y automática.
      </p>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="rounded-lg border border-[#2d3139] bg-black/20 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
            <Headphones className="h-4 w-4 text-[#2b7fff]" />
            <span>Soporte</span>
          </h3>
          <p className="text-xs text-[#8b949e]">
            ¿Tienes problemas con tu compra? Abre un ticket en nuestro Discord
            oficial para recibir ayuda de nuestro equipo.
          </p>
        </div>

        <div className="rounded-lg border border-[#2d3139] bg-black/20 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
            <ShieldAlert className="h-4 w-4 text-[#2b7fff]" />
            <span>Términos</span>
          </h3>
          <p className="text-xs text-[#8b949e]">
            Los pagos son finales y no reembolsables. Las disputas o
            contracargos resultarán en una sanción permanente dentro de la red.
          </p>
        </div>
      </div>
    </section>
  );
}
