import type { PaymentDetails } from "@/types/webstore";

/**
 * Funciones del navegador para pagar. Solo hablan con las rutas de la propia tienda
 * (/api/checkout); esas rutas llaman a Coinstellation desde el servidor con la API key.
 */

export type CheckoutStatus = "pending" | "processing" | "completed" | "failed" | "cancelled" | "expired";

async function leerJson<T>(response: Response, porDefecto: string): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error((data as { error?: string }).error ?? porDefecto);
  }

  return data as T;
}

/** Crea el cobro del producto para el jugador indicado. */
export async function startCheckout(
  productId: string,
  playerName: string,
): Promise<{ payment: PaymentDetails; productName: string }> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, playerName }),
  });

  return leerJson(response, "No se pudo crear el pago.");
}

/** Estado actual del pago en Coinstellation. */
export async function getCheckoutStatus(
  paymentId: string,
): Promise<{ status: CheckoutStatus; failureReason: string | null }> {
  const response = await fetch(`/api/checkout/${encodeURIComponent(paymentId)}`, { cache: "no-store" });
  return leerJson(response, "No se pudo consultar el pago.");
}
