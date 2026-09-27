import { NextResponse } from "next/server";
import {
  EXTERNAL_PAYMENTS_API_URL,
  STORE_KEY,
  DEFAULT_DESTINATION_WALLET,
  DEFAULT_CURRENCY,
  ENABLE_MOCK_PAYMENT,
} from "@/lib/payment-config";
import { PaymentRequestPayload, PaymentApiResponse } from "@/types/webstore";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Simulación / Mock para desarrollo local desconectado
    if (ENABLE_MOCK_PAYMENT || body.mock === true) {
      const memo = Date.now().toString();
      const mockUri = `web+stellar:pay?destination=${encodeURIComponent(
        body.destination || DEFAULT_DESTINATION_WALLET
      )}&amount=${body.amount ?? "24.99"}&asset_code=${
        body.currency || DEFAULT_CURRENCY
      }&memo=${memo}&memo_type=MEMO_ID`;

      const mockResponse: PaymentApiResponse = {
        payment: {
          id: `pay_${Date.now()}`,
          memo,
          uri: mockUri,
          qr: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
            mockUri
          )}`,
        },
      };
      return NextResponse.json(mockResponse, { status: 200 });
    }

    // Datos del pago con fallbacks a la configuración por defecto
    const payload: PaymentRequestPayload = {
      destination: body.destination || DEFAULT_DESTINATION_WALLET,
      amount: String(body.amount ?? "1.00"),
      currency: body.currency || DEFAULT_CURRENCY,
      description: body.description || "Orden de compra en Webstore",
      packageId: body.packageId,
    };

    // Validar que se haya configurado una URL
    const targetBaseUrl = EXTERNAL_PAYMENTS_API_URL.trim().replace(/\/+$/, "");
    const targetEndpoint = `${targetBaseUrl}/api/payments/create`;

    // Si la URL sigue siendo el placeholder por defecto, advertir al usuario
    if (
      !targetBaseUrl ||
      targetBaseUrl.includes("tu-url-de-api-aqui.com")
    ) {
      return NextResponse.json(
        {
          error: "URL_NOT_CONFIGURED",
          message:
            "Aún no has configurado la URL de Coinstellation. Por favor actualiza COINSTELLATION_API_URL en .env.local (por ejemplo http://localhost:3000).",
          targetEndpoint,
        },
        { status: 400 }
      );
    }

    // Llamada al endpoint de pagos del sistema principal Coinstellation
    const externalResponse = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Store-Key": STORE_KEY,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await externalResponse.json().catch(() => null);

    if (!externalResponse.ok) {
      return NextResponse.json(
        {
          error: "EXTERNAL_API_ERROR",
          status: externalResponse.status,
          message:
            responseData?.message ||
            responseData?.error ||
            `Error al comunicarse con Coinstellation (${externalResponse.status}).`,
          details: responseData,
        },
        { status: externalResponse.status }
      );
    }

    return NextResponse.json(responseData as PaymentApiResponse, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error en /api/payments/create:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message:
          error?.message ||
          "Error al procesar la solicitud de pago hacia Coinstellation.",
      },
      { status: 500 }
    );
  }
}
