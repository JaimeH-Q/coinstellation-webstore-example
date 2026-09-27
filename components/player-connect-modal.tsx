"use client";

import React, { useState } from "react";
import { X, User, Zap } from "lucide-react";

interface PlayerConnectModalProps {
  isOpen: boolean;
  currentUsername: string;
  onClose: () => void;
  onSavePlayer: (username: string) => void;
}

export function PlayerConnectModal({
  isOpen,
  currentUsername,
  onClose,
  onSavePlayer,
}: PlayerConnectModalProps) {
  const [username, setUsername] = useState(currentUsername === "Invitado" ? "" : currentUsername);

  if (!isOpen) return null;

  const handleSave = () => {
    const finalUser = username.trim() || "Steve";
    onSavePlayer(finalUser);
    onClose();
  };

  const avatarPreview = username.trim()
    ? `https://mc-heads.net/avatar/${encodeURIComponent(username.trim())}/80`
    : "https://mc-heads.net/avatar/Steve/80";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-blue-500/40 bg-[#0d0f1a] p-6 shadow-2xl shadow-blue-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="h-5 w-5 text-blue-400" />
          <span>Identificación de Jugador</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Ingresa tu Nick de Minecraft para que las compras se entreguen en tu cuenta automáticamente.
        </p>

        {/* Minecraft Nick Form */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-black/40 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarPreview}
              alt="Minecraft Skin Preview"
              width={56}
              height={56}
              className="h-14 w-14 rounded-lg border border-blue-500/30 bg-zinc-900 object-cover shadow-md"
            />
            <div className="flex-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Tu Usuario de Minecraft
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
                placeholder="Ej: Notch, Steve, TuNick..."
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900/90 px-3 py-2 text-sm font-bold text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <Zap className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Entrega instantánea.</span>
          </div>
        </div>

        {/* Confirm */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            className="w-full cursor-pointer rounded-xl border border-blue-500/40 bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99]"
          >
            Guardar Jugador
          </button>
        </div>
      </div>
    </div>
  );
}
