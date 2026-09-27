import {
  COINSTELLATION_API_URL,
  COINSTELLATION_API_KEY,
  DEFAULT_DESTINATION_WALLET,
  DEFAULT_CURRENCY,
} from "./payment-config";
import { PaymentApiResponse } from "@/types/webstore";

export interface CreatePaymentOptions {
  amount: string | number;
  description?: string;
  destination?: string;
  currency?: string;
  packageId?: string;
}

/**
 * Cliente SDK de pagos según las especificaciones de la
 * Sección API del Dashboard (SDK Node/TypeScript interactivo):
 *
 * ```ts
 * import { Coinstellation } from '@/lib/payment-service';
 * const pay = new Coinstellation({ apiKey: 'cs_live_99' });
 * await pay.checkout.process({ amount: 24.99, currency: 'USD' });
 * ```
 */
export class Coinstellation {
  private apiKey: string;
  private baseUrl: string;

  constructor(config?: { apiKey?: string; baseUrl?: string }) {
    this.apiKey = config?.apiKey || COINSTELLATION_API_KEY;
    this.baseUrl = (config?.baseUrl || COINSTELLATION_API_URL).trim().replace(/\/+$/, "");
  }

  public checkout = {
    process: async (options: CreatePaymentOptions): Promise<PaymentApiResponse> => {
      const endpoint = `${this.baseUrl}/api/payments/create`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Store-Key": this.apiKey,
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          destination: options.destination || DEFAULT_DESTINATION_WALLET,
          amount: String(options.amount),
          currency: options.currency || DEFAULT_CURRENCY,
          description: options.description || "Orden de compra",
          packageId: options.packageId,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.error ||
          `Error al comunicarse con la pasarela de pagos (${response.status})`
        );
      }

      return data as PaymentApiResponse;
    },

    validate: async (
      paymentId: string,
      txHash?: string
    ): Promise<{ payment: any; record?: any }> => {
      const endpoint = `${this.baseUrl}/api/payments/${paymentId}/validate`;
      const hash =
        txHash ||
        `tx_auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Store-Key": this.apiKey,
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ txHash: hash }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.error ||
          `Error al validar el pago en la pasarela (${response.status})`
        );
      }

      return data;
    },
  };
}

// Instancia singleton por defecto con credenciales de la Sección API
export const coinstellation = new Coinstellation();

/**
 * Función directa para crear orden de cobro en la pasarela
 */
export async function createPayment(options: CreatePaymentOptions): Promise<PaymentApiResponse> {
  return coinstellation.checkout.process(options);
}

/**
 * Función directa para validar pago completado en la pasarela
 */
export async function validatePayment(
  paymentId: string,
  txHash?: string
): Promise<{ payment: any; record?: any }> {
  return coinstellation.checkout.validate(paymentId, txHash);
}
