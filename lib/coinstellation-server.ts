/**
 * Cliente de la API de Coinstellation. SOLO para el servidor de la tienda (route handlers):
 * usa la API key de .env.local, que nunca debe llegar al navegador. Las variables no llevan
 * el prefijo NEXT_PUBLIC_, así que Next.js no las incluye en el código del cliente.
 */

export class CoinstellationError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

interface CoinstellationConfig {
  apiUrl: string;
  apiKey: string;
  wallet: string;
}

/** Lee la configuración de .env.local y avisa con un mensaje claro si falta algo. */
export function getCoinstellationConfig(): CoinstellationConfig {
  const apiUrl = process.env.COINSTELLATION_API_URL?.trim().replace(/\/+$/, "");
  const apiKey = process.env.COINSTELLATION_API_KEY?.trim();
  const wallet = process.env.COINSTELLATION_WALLET?.trim();
  const missing = [
    !apiUrl && "COINSTELLATION_API_URL",
    !apiKey && "COINSTELLATION_API_KEY",
    !wallet && "COINSTELLATION_WALLET",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new CoinstellationError(
      503,
      `Falta configurar ${missing.join(", ")} en .env.local de la tienda (y reiniciarla).`,
    );
  }

  return { apiUrl: apiUrl!, apiKey: apiKey!, wallet: wallet! };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { apiUrl, apiKey } = getCoinstellationConfig();
  let response: Response;

  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...init,
      cache: "no-store",
      headers: { "Content-Type": "application/json", "X-Store-Key": apiKey, ...init.headers },
    });
  } catch {
    throw new CoinstellationError(502, `No se pudo conectar con Coinstellation en ${apiUrl}.`);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new CoinstellationError(response.status, data.error ?? `Coinstellation respondió ${response.status}.`);
  }

  return data as T;
}

/** Pago creado en Coinstellation (lo que necesita el comprador para pagar). */
export interface CoinstellationPayment {
  /** ID del intent; se usa para consultar el estado. */
  id: string;
  status: string;
  network: string;
  destination: string;
  amount: string;
  /** "native" para XLM, o el código del activo (p. ej. "USDC"). */
  asset: string;
  memo: string;
  uri: string;
  qr: string;
}

export type CoinstellationPaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired";

/**
 * Crea el cobro de un paquete. El monto y el activo los define el paquete en Coinstellation.
 * `playerName` reemplaza %p% en los comandos que se ejecutan en el servidor de juego.
 */
export async function createCoinstellationPayment(input: {
  packageId: string;
  playerName: string;
  reference?: string;
}): Promise<CoinstellationPayment> {
  const { wallet } = getCoinstellationConfig();
  const data = await request<{ payment: CoinstellationPayment }>("/api/payments/create", {
    method: "POST",
    body: JSON.stringify({ ...input, destination: wallet }),
  });

  return data.payment;
}

/** Estado actual de un pago, buscado por el ID del intent (payment.id). */
export async function getCoinstellationPaymentStatus(
  paymentId: string,
): Promise<{ status: CoinstellationPaymentStatus; failureReason: string | null } | null> {
  const data = await request<{
    payments: { cosmosIntentId: string; status: CoinstellationPaymentStatus; failureReason: string | null }[];
  }>("/api/payments?count=200");
  const payment = data.payments.find((p) => p.cosmosIntentId === paymentId);

  return payment ? { status: payment.status, failureReason: payment.failureReason ?? null } : null;
}
