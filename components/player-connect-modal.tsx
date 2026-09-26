"use client";

import React, { useState } from "react";
import { X, Check, Wallet, User, Zap, Sparkles } from "lucide-react";

interface PlayerConnectModalProps {
  isOpen: boolean;
  currentUsername: string;
  currentWallet?: string | null;
  onClose: () => void;
  onSavePlayer: (username: string, wallet?: string | null) => void;
}

const WALLET_OPTIONS = [
  { name: "Phantom (Solana)", icon: "🟣", network: "Solana", fee: "~$0.001" },
  { name: "MetaMask (ETH / Polygon)", icon: "🦊", network: "Ethereum / L2", fee: "Instant" },
  { name: "TON Wallet (Telegram)", icon: "💎", network: "TON Network", fee: "~$0.005" },
  { name: "Coinbase / Base Pay", icon: "🔵", network: "Base L2", fee: "Zero Gas" },
];

export function PlayerConnectModal({
  isOpen,
  currentUsername,
  currentWallet,
  onClose,
  onSavePlayer,
}: PlayerConnectModalProps) {
  const [username, setUsername] = useState(currentUsername === "Invitado" ? "" : currentUsername);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(currentWallet || null);
  const [activeTab, setActiveTab] = useState<"minecraft" | "wallet">("minecraft");
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const handleWalletSelect = (walletName: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      setSelectedWallet(walletName);
      setIsConnecting(false);
    }, 600);
  };

  const handleSave = () => {
    const finalUser = username.trim() || "Steve";
    onSavePlayer(finalUser, selectedWallet);
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
          <span>Identificación de Jugador & Web3</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Ingresa tu Nick de Minecraft para que las compras se entreguen en tu cuenta automáticamente.
        </p>

        {/* Tabs */}
        <div className="mt-4 flex rounded-xl bg-zinc-900/90 p-1 border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("minecraft")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
              activeTab === "minecraft"
                ? "bg-blue-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Minecraft Nick</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wallet")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
              activeTab === "wallet"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span>Conectar Wallet Web3</span>
          </button>
        </div>

        {/* Minecraft Tab */}
        {activeTab === "minecraft" && (
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
                  placeholder="Ej: Notch, Steve, TuNick..."
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900/90 px-3 py-2 text-sm font-bold text-white placeholder-zinc-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <Zap className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Entrega instantánea mediante plugin API sincronizado con el servidor.</span>
            </div>
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === "wallet" && (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 text-xs text-purple-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-purple-400" />
              <span>+10% de Gemas Extra al pagar con Crypto (Solana, TON, USDT, ETH).</span>
            </div>

            <div className="space-y-2">
              {WALLET_OPTIONS.map((w) => {
                const isSelected = selectedWallet === w.name;
                return (
                  <button
                    key={w.name}
                    type="button"
                    onClick={() => handleWalletSelect(w.name)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-950/50 text-white shadow-md shadow-purple-500/10"
                        : "border-zinc-800 bg-black/40 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{w.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{w.name}</div>
                        <div className="text-[11px] text-zinc-400">{w.network} • Gas: {w.fee}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <Check className="h-4 w-4" />
                        <span>Conectado</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Confirm */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={isConnecting}
            className="w-full rounded-xl border border-blue-500/40 bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99]"
          >
            Guardar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
