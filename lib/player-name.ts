/**
 * Mismas reglas que Coinstellation para el nombre de jugador: letras, números, "_" y ".".
 * Sin espacios, porque el nombre se inserta en comandos de consola del servidor (%p%).
 */
const PLAYER_NAME_PATTERN = /^[A-Za-z0-9_.]{1,32}$/;

export function isValidPlayerName(value: string): boolean {
  return PLAYER_NAME_PATTERN.test(value);
}
