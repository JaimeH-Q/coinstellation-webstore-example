import { ALL_PRODUCTS } from "@/data/mock-data";
import { getCoinstellationPackageId } from "@/data/coinstellation-packages";
import { CoinstellationError, createCoinstellationPayment } from "@/lib/coinstellation-server";
import { isValidPlayerName } from "@/lib/player-name";
import type { PaymentDetails } from "@/types/webstore";

/**
 * POST /api/checkout { productId, playerName }
 * Crea en Coinstellation el cobro del paquete vinculado al producto (desde el servidor,
 * para no exponer la API key) y devuelve lo necesario para que el comprador pague.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { productId?: unknown; playerName?: unknown } | null;
  const productId = typeof body?.productId === "string" ? body.productId : "";
  const playerName = typeof body?.playerName === "string" ? body.playerName.trim() : "";

  const product = ALL_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return Response.json({ error: "Producto no encontrado." }, { status: 404 });
  }

  if (!isValidPlayerName(playerName)) {
    return Response.json(
      { error: "El nombre de jugador solo puede tener letras, números, _ y . (máx. 32 caracteres)." },
      { status: 422 },
    );
  }

  const packageId = getCoinstellationPackageId(product.id);

  if (!packageId) {
    return Response.json(
      {
        error: `"${product.name}" todavía no está vinculado a un paquete de Coinstellation. Agrega su ID en data/coinstellation-packages.ts ("${product.id}").`,
      },
      { status: 409 },
    );
  }

  try {
    const payment = await createCoinstellationPayment({
      packageId,
      playerName,
      reference: `${product.id}:${playerName}`,
    });

    const details: PaymentDetails = {
      id: payment.id,
      amount: payment.amount,
      asset: payment.asset === "native" ? "XLM" : payment.asset,
      destination: payment.destination,
      memo: payment.memo,
      uri: payment.uri,
      qr: payment.qr,
    };

    return Response.json({ payment: details, productName: product.name }, { status: 201 });
  } catch (error) {
    if (error instanceof CoinstellationError) {
      // 404 de Coinstellation = el ID pegado no corresponde a un paquete de esta cuenta.
      const message =
        error.status === 404
          ? `El paquete vinculado a "${product.name}" no existe en tu cuenta de Coinstellation. Revisa su ID en data/coinstellation-packages.ts.`
          : error.status === 401
            ? "La API key de Coinstellation no es válida. Revisa COINSTELLATION_API_KEY en .env.local."
            : error.message;
      return Response.json({ error: message }, { status: error.status === 401 ? 500 : error.status });
    }

    return Response.json({ error: "No se pudo crear el pago." }, { status: 500 });
  }
}
