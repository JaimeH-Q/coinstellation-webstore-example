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
  Link2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { PaymentDetails } from "@/types/webstore";
import { validatePayment } from "@/lib/payment-service";

interface PaymentModalProps {
  isOpen: boolean;
  payment: PaymentDetails | null;
  amount: number | string;
  currency?: string;
  description?: string;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export function PaymentModal({
  isOpen,
  payment,
  amount,
  currency = "USDC",
  description,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedTxHash, setConfirmedTxHash] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset states when opening a new payment
  useEffect(() => {
    if (isOpen) {
      setIsConfirmed(false);
      setConfirmedTxHash(null);
      setValidationError(null);
      setIsValidating(false);
    }
  }, [isOpen, payment?.id]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isValidating) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isValidating, onClose]);

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

  const handleConfirmSale = async () => {
    setIsValidating(true);
    setValidationError(null);

    try {
      const generatedTx = `tx_auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      await validatePayment(payment.id, generatedTx);
      setIsConfirmed(true);
      setConfirmedTxHash(generatedTx);
      onPaymentSuccess?.();
    } catch (err: any) {
      console.error("Error validando venta:", err);
      setValidationError(
        err.message || "No se pudo validar el pago en la pasarela."
      );
    } finally {
      setIsValidating(false);
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
            alt="Código QR de pago"
            className="h-44 w-44 rounded-lg bg-white p-2 shadow-inner object-contain"
          />
        );
      }
      return (
        <div className="flex h-44 w-44 items-center justify-center rounded-lg bg-[#121316] text-xs text-[#8b949e]">
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
          alt="Código QR de pago"
          className="h-44 w-44 rounded-lg bg-white p-2 shadow-inner object-contain"
        />
      );
    }

    if (payment.qr.trim().startsWith("<svg")) {
      return (
        <div
          className="h-44 w-44 rounded-lg bg-white p-2 shadow-inner flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: payment.qr }}
        />
      );
    }

    const base64Src = `data:image/png;base64,${payment.qr}`;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={base64Src}
        alt="Código QR de pago"
        className="h-44 w-44 rounded-lg bg-white p-2 shadow-inner object-contain"
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
          disabled={isValidating}
          aria-label="Cerrar ventana de pago"
          className="absolute top-4 right-4 cursor-pointer text-[#8b949e] transition-colors hover:text-white disabled:opacity-30"
        >
          <X className="h-5 w-5" />
        </button>

        {isConfirmed ? (
          /* ============================================================== */
          /* PANTALLA DE ÉXITO CUANDO LA VENTA SE HA EFECTUADO CON ÉXITO    */
          /* ============================================================== */
          <div className="flex flex-col items-center text-center py-2 animate-in zoom-in-95 duration-200">
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <h3 className="text-xl font-black text-white">
              ¡Pago Completado con Éxito!
            </h3>
            <p className="mt-1.5 text-xs text-[#8b949e] max-w-sm">
              La orden ha sido confirmada y registrada
              correctamente en el sistema principal.
            </p>

            {/* Tarjeta de Resumen de la Venta */}
            <div className="my-5 w-full rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-left">
              <div className="flex justify-between items-center border-b border-emerald-500/20 pb-2.5 mb-2.5">
                <span className="text-xs text-[#8b949e]">Total Abonado:</span>
                <span className="text-base font-extrabold text-[#2ecc71]">
                  {amount} {currency}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1">
                <span className="text-[#8b949e]">ID de Pago:</span>
                <span className="font-mono text-emerald-300 font-medium">
                  {payment.id.slice(0, 16)}...
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-1">
                <span className="text-[#8b949e]">Referencia de Pago:</span>
                <span className="font-mono text-emerald-300 font-medium">
                  {payment.memo}
                </span>
              </div>
              {confirmedTxHash && (
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-[#8b949e]">Código de Autorización:</span>
                  <span className="font-mono text-emerald-400/90 font-medium">
                    {confirmedTxHash.slice(0, 18)}...
                  </span>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col gap-2.5 w-full">
              <a
                href="http://localhost:3000/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-[#095a86] to-[#0284c7] hover:from-[#07476b] hover:to-[#0369a1] py-3 text-sm font-bold text-white transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                <span>Ver Venta en el Dashboard</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-[#2d3139] bg-[#141518] hover:bg-[#202227] py-2.5 text-xs font-semibold text-[#8b949e] hover:text-white transition-colors cursor-pointer"
              >
                Cerrar y Continuar en la Tienda
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* PANTALLA DE PAGO / CHECKOUT CON LINK, QR, REFERENCIA Y VALIDACIÓN */
          /* ============================================================== */
          <>
            {/* Encabezado */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2b7fff]/15 text-[#2b7fff]">
                <Link2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Link de Pago Generado ({currency})
                </h3>
                {description && (
                  <p className="text-xs text-[#8b949e]">{description}</p>
                )}
              </div>
            </div>

            {/* Total a pagar */}
            <div className="my-3 rounded-xl border border-[#2d3139] bg-[#141518] p-3 text-center">
              <p className="text-xs font-medium text-[#8b949e] uppercase tracking-wider">
                Total a Pagar
              </p>
              <p className="text-2xl sm:text-3xl font-black text-[#2ecc71] mt-0.5">
                {amount} {currency}
              </p>
            </div>

            {/* Código QR */}
            <div className="flex flex-col items-center justify-center my-3">
              <div className="rounded-xl border border-[#2d3139] bg-[#121316] p-2.5 shadow-md">
                {renderQrCode()}
              </div>
              <span className="mt-1.5 text-[11px] text-[#8b949e] flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5 text-[#2b7fff]" />
                Escanea con tu aplicación de pagos o lector QR
              </span>
            </div>

            {/* Campo Referencia */}
            <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>REFERENCIA DE PAGO</span>
                  </div>
                  <p className="mt-1 text-xs text-amber-200/90 font-mono font-semibold break-all">
                    {payment.memo}
                  </p>
                  <p className="mt-0.5 text-[11px] text-amber-300/70">
                    Conserva esta referencia para la acreditación automática de tu compra.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(payment.memo, "memo")}
                  className="flex shrink-0 items-center gap-1 rounded-md bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/30 cursor-pointer"
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

            {/* Error si ocurre durante la confirmación */}
            {validationError && (
              <div className="mt-3 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="mt-4 flex flex-col gap-2">
              {/* Botón principal: Confirmar Pago */}
              <button
                type="button"
                onClick={handleConfirmSale}
                disabled={isValidating}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3 text-sm font-bold text-white transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verificando transacción...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirmar Pago</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {payment.uri && (
                <div className="flex items-center justify-between text-xs text-[#8b949e] px-1 pt-1">
                  <a
                    href={payment.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-[#2b7fff] hover:underline flex items-center gap-1 font-medium"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Abrir link de pago</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(payment.uri, "uri")}
                    className="cursor-pointer text-[#8b949e] hover:text-white transition-colors"
                  >
                    {copiedUri ? "¡Link Copiado!" : "Copiar link de pago"}
                  </button>
                </div>
              )}
            </div>

            {/* ID de la Orden */}
            <div className="mt-3 flex items-center justify-between border-t border-[#2d3139] pt-2.5 text-[11px] text-[#8b949e]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2ecc71]" />
                Pasarela de Pago Segura
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
          </>
        )}
      </div>
    </div>
  );
}
