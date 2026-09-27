import { PaymentApiResponse } from "@/types/webstore";

export interface CreatePaymentOptions {
  amount: string | number;
  description?: string;
  destination?: string;
  currency?: string;
  packageId?: string;
}

/**
 * Crea una orden de pago llamando al endpoint interno que conecta
 * de forma segura con la API principal de Coinstellation.
 */
export async function createPayment({
  amount,
  description = "Orden de compra",
  destination,
  currency = "XLM",
  packageId,
}: CreatePaymentOptions): Promise<PaymentApiResponse> {
  const response = await fetch("/api/payments/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: String(amount),
      description,
      destination,
      currency,
      packageId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Error creando el pago (${response.status})`
    );
  }

  return data;
}

/**
 * Valida un pago completado en la red Stellar comunicándolo al backend de Coinstellation.
 */
export async function validatePayment(
  paymentId: string,
  txHash?: string
): Promise<{ payment: any; record?: any }> {
  const hash =
    txHash ||
    `tx_stellar_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const response = await fetch(`/api/payments/${paymentId}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ txHash: hash }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Error al validar el pago (${response.status})`
    );
  }

  return data;
}
