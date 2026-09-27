"use client";

import React, { useEffect, useState } from "react";
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
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { PaymentDetails } from "@/types/webstore";
import { getCheckoutStatus, type CheckoutStatus } from "@/lib/checkout-client";
import { copyText } from "@/lib/copy-text";

/** Cada cuánto se consulta el estado del pago mientras el modal está abierto. */
const POLL_INTERVAL_MS = 5000;

type CopyTarget = "memo" | "uri" | "destination" | "id";

interface PaymentModalProps {
  isOpen: boolean;
  payment: PaymentDetails | null;
  /** Nombre del producto que se está pagando. */
  productName?: string;
  /** Jugador que recibe la compra en el servidor. */
  playerName?: string;
  /** Ítems que quedan en el carrito después de este pago. */
  remainingItems?: number;
  onClose: () => void;
  /** Se llama una sola vez, cuando Coinstellation confirma el pago. */
  onPaymentSuccess?: () => void;
  /** Pagar el siguiente ítem del carrito. */
  onPayNext?: () => void;
}

/**
 * Modal de pago. El estado se reinicia al cambiar de pago porque el padre lo monta con
 * key={payment.id}. El pago se confirma solo: Coinstellation lo detecta en la blockchain
 * (con el memo) y este modal lo consulta cada POLL_INTERVAL_MS.
 */
export function PaymentModal({
  isOpen,
  payment,
  productName,
  playerName,
  remainingItems = 0,
  onClose,
  onPaymentSuccess,
  onPayNext,
}: PaymentModalProps) {
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [status, setStatus] = useState<CheckoutStatus>("pending");
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);

  const isFinished = status === "completed" || status === "failed" || status === "cancelled" || status === "expired";

  // Consulta el estado del pago hasta que termine.
  useEffect(() => {
    if (!isOpen || !payment || isFinished) return;

    let active = true;
    const check = async () => {
      try {
        const result = await getCheckoutStatus(payment.id);
        if (!active) return;
        setPollError(null);
        setStatus(result.status);
        setFailureReason(result.failureReason);
        if (result.status === "completed") onPaymentSuccess?.();
      } catch (error) {
        if (active) setPollError(error instanceof Error ? error.message : "No se pudo consultar el pago.");
      }
    };

    const timer = setInterval(check, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [isOpen, payment, isFinished, onPaymentSuccess]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !payment) return null;

  const handleCopy = async (text: string, target: CopyTarget) => {
    if (await copyText(text)) {
      setCopyError(false);
      setCopied(target);
      setTimeout(() => setCopied((current) => (current === target ? null : current)), 2000);
    } else {
      setCopyError(true);
    }
  };

  const renderCopyButton = (text: string, target: CopyTarget, label = "Copiar") => (
    <button
      type="button"
      onClick={() => handleCopy(text, target)}
      className="flex shrink-0 items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs font-semibold text-[#c9d1d9] transition-colors hover:bg-white/10 cursor-pointer"
    >
      {copied === target ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-emerald-400">¡Copiado!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-[#2d3139] bg-[#1c1e22] p-6 shadow-2xl transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana de pago"
          className="absolute top-4 right-4 cursor-pointer text-[#8b949e] transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "completed" ? (
          /* ======================= PAGO CONFIRMADO ======================= */
          <div className="flex flex-col items-center text-center py-2 animate-in zoom-in-95 duration-200">
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h3 className="text-xl font-black text-white">¡Pago recibido!</h3>
            <p className="mt-1.5 text-xs text-[#8b949e] max-w-sm">
              Coinstellation confirmó el pago en la red Stellar.
              {playerName ? ` ${playerName} recibirá la compra en el servidor en unos instantes.` : ""}
            </p>

            <div className="my-5 w-full rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-left">
              {productName && (
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-[#8b949e]">Producto:</span>
                  <span className="font-bold text-white">{productName}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs py-1">
                <span className="text-[#8b949e]">Total pagado:</span>
                <span className="text-base font-extrabold text-[#2ecc71]">
                  {payment.amount} {payment.asset}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1">
                <span className="text-[#8b949e]">ID de pago:</span>
                <span className="font-mono text-emerald-300 font-medium">{payment.id.slice(0, 16)}…</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              {remainingItems > 0 && onPayNext && (
                <button
                  type="button"
                  onClick={onPayNext}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#095a86] to-[#0284c7] hover:from-[#07476b] hover:to-[#0369a1] py-3 text-sm font-bold text-white transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  <span>
                    Pagar el siguiente ({remainingItems} {remainingItems === 1 ? "queda" : "quedan"} en el carrito)
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-[#2d3139] bg-[#141518] hover:bg-[#202227] py-2.5 text-xs font-semibold text-[#8b949e] hover:text-white transition-colors cursor-pointer"
              >
                Cerrar y seguir en la tienda
              </button>
            </div>
          </div>
        ) : isFinished ? (
          /* ======================= PAGO FALLIDO / VENCIDO ======================= */
          <div className="flex flex-col items-center text-center py-2">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-red-400 ring-8 ring-red-500/10">
              <XCircle className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-black text-white">
              {status === "expired" ? "El pago venció" : status === "cancelled" ? "Pago cancelado" : "El pago no se pudo completar"}
            </h3>
            <p className="mt-1.5 text-xs text-[#8b949e] max-w-sm">
              {failureReason ?? "No se entregará la compra. Si ya enviaste fondos, contacta al servidor con el ID de pago."}
            </p>
            <p className="mt-3 font-mono text-[11px] text-[#8b949e]">ID: {payment.id}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-xl border border-[#2d3139] bg-[#141518] hover:bg-[#202227] py-2.5 text-xs font-semibold text-[#8b949e] hover:text-white transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        ) : (
          /* ======================= ESPERANDO EL PAGO ======================= */
          <>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2b7fff]/15 text-[#2b7fff]">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pago con Stellar ({payment.asset})</h3>
                {(productName || playerName) && (
                  <p className="text-xs text-[#8b949e]">
                    {productName}
                    {playerName ? ` · para ${playerName}` : ""}
                  </p>
                )}
              </div>
            </div>

            <div className="my-3 rounded-xl border border-[#2d3139] bg-[#141518] p-3 text-center">
              <p className="text-xs font-medium text-[#8b949e] uppercase tracking-wider">Monto a transferir</p>
              <p className="text-2xl sm:text-3xl font-black text-[#2ecc71] mt-0.5">
                {payment.amount} {payment.asset}
              </p>
            </div>

            {/* QR con el enlace de pago (incluye destino, monto, activo y memo) */}
            <div className="flex flex-col items-center justify-center my-3">
              <div className="rounded-xl border border-[#2d3139] bg-[#121316] p-2.5 shadow-md">
                {payment.qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={payment.qr}
                    alt="Código QR de pago Stellar"
                    className="h-44 w-44 rounded-lg bg-white p-2 shadow-inner object-contain"
                  />
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center rounded-lg bg-[#121316] text-xs text-[#8b949e]">
                    QR no disponible
                  </div>
                )}
              </div>
              <span className="mt-1.5 text-[11px] text-[#8b949e] flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5 text-[#2b7fff]" />
                Escanea con tu wallet Stellar (Lobstr, Freighter, xBull…)
              </span>
            </div>

            {payment.uri && (
              <div className="flex items-center justify-between gap-2 text-xs text-[#8b949e] px-1">
                <a
                  href={payment.uri}
                  className="cursor-pointer text-[#2b7fff] hover:underline flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Abrir en mi wallet</span>
                </a>
                {renderCopyButton(payment.uri, "uri", "Copiar enlace de pago")}
              </div>
            )}

            {/* Datos para pagar a mano: el memo es obligatorio */}
            <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>¿Pagas a mano? Usa exactamente estos datos</span>
              </div>
              <p className="mt-1 text-[11px] text-amber-300/80">
                Sin el memo, el pago no se puede asociar a tu compra y no se entrega.
              </p>
              <div className="mt-2 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-amber-300/70">Memo (ID) — obligatorio</p>
                    <p className="text-sm text-amber-100 font-mono font-bold break-all">{payment.memo}</p>
                  </div>
                  {renderCopyButton(payment.memo, "memo")}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-amber-300/70">Destino</p>
                    <p className="text-[11px] text-amber-100 font-mono break-all">{payment.destination}</p>
                  </div>
                  {renderCopyButton(payment.destination, "destination")}
                </div>
              </div>
            </div>

            {copyError && (
              <p className="mt-2 text-[11px] text-red-300">
                No se pudo copiar: selecciona el texto y cópialo con Ctrl+C.
              </p>
            )}

            {/* Estado: se actualiza solo */}
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#2d3139] bg-[#141518] py-3 text-xs text-[#c9d1d9]">
              <Loader2 className="h-4 w-4 animate-spin text-[#2b7fff]" />
              <span>
                {status === "processing"
                  ? "Transacción recibida, confirmando…"
                  : "Esperando el pago… se confirma solo al llegar a la red (hasta ~1 min)."}
              </span>
            </div>
            {pollError && <p className="mt-2 text-[11px] text-red-300">{pollError}</p>}

            <div className="mt-3 flex items-center justify-between border-t border-[#2d3139] pt-2.5 text-[11px] text-[#8b949e]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2ecc71]" />
                Pasarela Coinstellation
              </span>
              <button
                type="button"
                onClick={() => handleCopy(payment.id, "id")}
                className="font-mono text-[#8b949e] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                ID: {payment.id.slice(0, 10)}…
                {copied === "id" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
