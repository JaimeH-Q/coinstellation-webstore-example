/**
 * ============================================================================
 * CONFIGURACIÓN DE LA PASARELA DE PAGOS (COINSTELLATION)
 * ============================================================================
 * 
 * ✏️ VARIABLE PRINCIPAL PARA LA URL:
 * Puedes definir la URL directamente en la variable EXTERNAL_PAYMENTS_API_URL
 * o a través de la variable de entorno COINSTELLATION_API_URL en tu archivo .env.local
 */

// 👉 CAMBIA ESTA VARIABLE POR LA URL DE TU SERVICIO EXTERNO:
export const EXTERNAL_PAYMENTS_API_URL =
  process.env.COINSTELLATION_API_URL ||
  process.env.NEXT_PUBLIC_COINSTELLATION_API_URL ||
  "https://tu-url-de-api-aqui.com";

/**
 * Clave de tienda para el header 'X-Store-Key'
 */
export const STORE_KEY =
  process.env.COINSTELLATION_STORE_KEY ||
  "tu_clave_de_webstore";

/**
 * Wallet pública Stellar del creador/tienda donde se recibirán los pagos (destino)
 */
export const DEFAULT_DESTINATION_WALLET =
  process.env.COINSTELLATION_DESTINATION_WALLET ||
  "G...WALLET_DEL_CREADOR";

/**
 * Moneda por defecto para los pagos
 */
export const DEFAULT_CURRENCY = "XLM";

/**
 * Modo Simulación / Mock (opcional):
 * Si es 'true', permite probar el modal y el flujo de pago con datos de ejemplo
 * sin necesidad de tener el servidor externo encendido.
 */
export const ENABLE_MOCK_PAYMENT =
  process.env.COINSTELLATION_ENABLE_MOCK === "true" || false;
