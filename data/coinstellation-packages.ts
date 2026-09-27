/**
 * ============================================================================
 * VÍNCULO ENTRE LOS PRODUCTOS DE LA TIENDA Y LOS PAQUETES DE COINSTELLATION
 * ============================================================================
 *
 * Cada producto de la tienda (data/mock-data.ts) se cobra con un paquete creado en el
 * panel de Coinstellation (Dashboard → Paquetes). Pega acá el ID de ese paquete.
 *
 * - El precio y el activo (XLM / USDC) que se cobran son los del paquete en Coinstellation,
 *   no el precio de mock-data.ts (ese solo se muestra en la tienda).
 * - Los comandos que se ejecutan en el servidor al completarse el pago también se
 *   configuran en el paquete.
 * - Un producto con el ID vacío no se puede comprar: la tienda avisa al intentar pagarlo.
 *
 * Para ver el ID: en el panel, Dashboard → API, elige el paquete en "Simular pago" y copia
 * el `packageId` del código de ejemplo (también lo devuelve GET /api/packages).
 */
export const COINSTELLATION_PACKAGE_IDS: Record<string, string> = {
  // Rangos
  "rank-vip": "",
  "rank-mvp-plus": "",
  "rank-netherite-god": "",

  // Llaves & crates
  "crate-cosmic-pack5": "",
  "crate-spawner-keys": "",
  "crate-nether-supreme": "",

  // Spawners
  "spawner-iron-golem": "",
  "spawner-elemental-pack": "",

  // Boosters & pases
  "booster-battlepass-nether": "",
  "booster-global-xp-coins": "",

  // Cosméticos
  "cosmetic-dragon-cape": "",
  "cosmetic-diamond-aura": "",

  // Gemas
  "coins-pack-5000": "",
  "coins-pack-15000": "",
};

/** ID del paquete de Coinstellation para un producto de la tienda, o null si no está vinculado. */
export function getCoinstellationPackageId(productId: string): string | null {
  return COINSTELLATION_PACKAGE_IDS[productId]?.trim() || null;
}
