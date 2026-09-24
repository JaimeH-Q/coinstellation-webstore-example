import { PaymentApiResponse } from "@/types/webstore";

export interface CreatePaymentOptions {
  amount: string | number;
  description?: string;
  destination?: string;
  currency?: string;
}

/**
 * Crea una orden de pago llamando al endpoint interno que conecta
 * de forma segura con la API externa de Coinstellation / Stellar.
 */
export async function createPayment({
  amount,
  description = "Orden de compra",
  destination,
  currency = "XLM",
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
