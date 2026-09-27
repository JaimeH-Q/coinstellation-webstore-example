/**
 * ============================================================================
 * CONFIGURACIÓN DE LA PASARELA DE PAGOS (COINSTELLATION)
 * ============================================================================
 * 
 * Datos obtenidos directamente de la Sección API del Dashboard de Coinstellation:
 * - API Key Activa: cs_live_99
 * - Endpoint Base: http://localhost:3000 (o https://api.coinstellation.com/v1)
 * - Autenticación: 'X-Store-Key: cs_live_99' y 'Authorization: Bearer cs_live_99'
 * - Wallet Stellar de destino: G...
 */

export const COINSTELLATION_API_URL =
  process.env.NEXT_PUBLIC_COINSTELLATION_API_URL ||
  process.env.COINSTELLATION_API_URL ||
  "http://localhost:3000";

export const COINSTELLATION_API_KEY =
  process.env.NEXT_PUBLIC_COINSTELLATION_API_KEY ||
  process.env.COINSTELLATION_STORE_KEY ||
  "cs_live_99";

export const DEFAULT_DESTINATION_WALLET =
  process.env.NEXT_PUBLIC_COINSTELLATION_DESTINATION_WALLET ||
  process.env.COINSTELLATION_DESTINATION_WALLET ||
  "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";

export const DEFAULT_CURRENCY = "XLM";
