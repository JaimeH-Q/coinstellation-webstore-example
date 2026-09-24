"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Wallet,
} from "lucide-react";
import { PaymentDetails } from "@/types/webstore";

interface PaymentModalProps {
  isOpen: boolean;
  payment: PaymentDetails | null;
  amount: number | string;
  currency?: string;
  description?: string;
  onClose: () => void;
}

export function PaymentModal({
  isOpen,
  payment,
  amount,
  currency = "XLM",
  description,
  onClose,
}: PaymentModalProps) {
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !payment) return null;

  const handleCopy = (text: string, type: "memo" | "uri" | "id") => {
    navigator.clipboard.writeText(text);
    if (type === "memo") {
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 2000);
    } else if (type === "uri") {
      setCopiedUri(true);
      setTimeout(() => setCopiedUri(false), 2000);
    } else if (type === "id") {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Determinar formato del QR
  const renderQrCode = () => {
    if (!payment.qr) {
      if (payment.uri) {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
          payment.uri
        )}`;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrUrl}
            alt="Código QR de pago Stellar"
            className="h-48 w-48 rounded-lg bg-white p-2 shadow-inner object-contain"
          />
        );
      }
      return (
        <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-[#121316] text-xs text-[#8b949e]">
          QR no disponible
        </div>
      );
    }

    if (
      payment.qr.startsWith("data:image/") ||
      payment.qr.startsWith("http://") ||
      payment.qr.startsWith("https://")
    ) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={payment.qr}
          alt="Código QR de pago Stellar"
          className="h-48 w-48 rounded-lg bg-white p-2 shadow-inner object-contain"
        />
      );
    }

    if (payment.qr.trim().startsWith("<svg")) {
      return (
        <div
          className="h-48 w-48 rounded-lg bg-white p-2 shadow-inner flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: payment.qr }}
        />
      );
    }

    // Si es base64 puro sin prefijo
    const base64Src = `data:image/png;base64,${payment.qr}`;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={base64Src}
        alt="Código QR de pago Stellar"
        className="h-48 w-48 rounded-lg bg-white p-2 shadow-inner object-contain"
      />
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-[#2d3139] bg-[#1c1e22] p-6 shadow-2xl transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana de pago"
          className="absolute top-4 right-4 cursor-pointer text-[#8b949e] transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2b7fff]/15 text-[#2b7fff]">
            <Wallet className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Pago con Stellar ({currency})
            </h3>
            {description && (
              <p className="text-xs text-[#8b949e]">{description}</p>
            )}
          </div>
        </div>

        {/* Total a pagar */}
        <div className="my-4 rounded-xl border border-[#2d3139] bg-[#141518] p-4 text-center">
          <p className="text-xs font-medium text-[#8b949e] uppercase tracking-wider">
            Monto a Transferir
          </p>
          <p className="text-2xl sm:text-3xl font-black text-[#2ecc71] mt-1">
            {amount} {currency}
          </p>
        </div>

        {/* Código QR */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="rounded-xl border border-[#2d3139] bg-[#121316] p-3 shadow-md">
            {renderQrCode()}
          </div>
          <span className="mt-2 text-xs text-[#8b949e] flex items-center gap-1.5">
            <QrCode className="h-3.5 w-3.5 text-[#2b7fff]" />
            Escanea con tu billetera Stellar (ej: Lobstr, Freighter)
          </span>
        </div>

        {/* Campo MEMO - Crucial para Stellar */}
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>MEMO OBLIGATORIO</span>
              </div>
              <p className="mt-1 text-xs text-amber-200/90 font-mono font-semibold break-all">
                {payment.memo}
              </p>
              <p className="mt-1 text-[11px] text-amber-300/70">
                Debes incluir este Memo en tu envío para identificar tu compra.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(payment.memo, "memo")}
              className="flex shrink-0 items-center gap-1 rounded-md bg-amber-500/20 px-2.5 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/30 cursor-pointer"
            >
              {copiedMemo ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Botón para abrir en Wallet */}
        {payment.uri && (
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={payment.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2b7fff] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1a62d6] shadow-md shadow-[#2b7fff]/20"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Abrir en Billetera Stellar (URI)</span>
            </a>
            <div className="flex items-center justify-between text-xs text-[#8b949e] px-1">
              <span>URI de pago:</span>
              <button
                type="button"
                onClick={() => handleCopy(payment.uri, "uri")}
                className="cursor-pointer text-[#2b7fff] hover:underline flex items-center gap-1 font-medium"
              >
                {copiedUri ? "¡URI Copiada!" : "Copiar enlace URI"}
              </button>
            </div>
          </div>
        )}

        {/* ID de la Orden / Pago */}
        <div className="mt-4 flex items-center justify-between border-t border-[#2d3139] pt-3 text-[11px] text-[#8b949e]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2ecc71]" />
            Pago seguro Coinstellation
          </span>
          <button
            type="button"
            onClick={() => handleCopy(payment.id, "id")}
            className="font-mono text-[#8b949e] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            ID: {payment.id.slice(0, 10)}...
            {copiedId ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>

        {/* Estado pendiente */}
        <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#141518] py-2 text-xs text-[#8b949e]">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2b7fff]" />
          <span>Esperando confirmación en la red Stellar...</span>
        </div>
      </div>
    </div>
  );
}
