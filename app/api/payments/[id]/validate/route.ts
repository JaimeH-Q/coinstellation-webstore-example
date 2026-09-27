import { NextResponse } from "next/server";
import { EXTERNAL_PAYMENTS_API_URL, STORE_KEY } from "@/lib/payment-config";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const txHash =
      body.txHash ||
      `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const targetBaseUrl = EXTERNAL_PAYMENTS_API_URL.trim().replace(/\/+$/, "");
    const targetEndpoint = `${targetBaseUrl}/api/payments/${id}/validate`;

    const externalResponse = await fetch(targetEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Store-Key": STORE_KEY,
      },
      body: JSON.stringify({ txHash }),
    });

    const responseData = await externalResponse.json().catch(() => null);

    if (!externalResponse.ok) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          status: externalResponse.status,
          message:
            responseData?.error ||
            responseData?.message ||
            "Error al validar el pago en Coinstellation.",
          details: responseData,
        },
        { status: externalResponse.status }
      );
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error("Error en validación de pago:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message:
          error?.message ||
          "Error al comunicarse con el servidor principal de Coinstellation.",
      },
      { status: 500 }
    );
  }
}
