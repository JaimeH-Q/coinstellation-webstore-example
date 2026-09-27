import { CoinstellationError, getCoinstellationPaymentStatus } from "@/lib/coinstellation-server";

/**
 * GET /api/checkout/:paymentId
 * Estado del pago en Coinstellation. El modal de pago lo consulta cada pocos segundos:
 * Coinstellation detecta el pago en la blockchain y lo pasa a "completed" por su cuenta.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;

  try {
    const result = await getCoinstellationPaymentStatus(paymentId);

    if (!result) {
      return Response.json({ error: "Pago no encontrado." }, { status: 404 });
    }

    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const status = error instanceof CoinstellationError ? error.status : 500;
    const message =
      status === 401
        ? "La API key de Coinstellation no es válida. Revisa COINSTELLATION_API_KEY en .env.local."
        : error instanceof Error
          ? error.message
          : "No se pudo consultar el pago.";
    return Response.json({ error: message }, { status: status === 401 ? 500 : status });
  }
}
