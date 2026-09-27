/**
 * Copia texto al portapapeles y devuelve si lo logró.
 *
 * `navigator.clipboard` solo existe en contextos seguros (HTTPS o localhost). Si la tienda
 * se abre por http://IP:puerto no está disponible, así que se usa el método clásico con un
 * <textarea> oculto y document.execCommand("copy").
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Si el navegador lo rechaza, se intenta con el método clásico.
    }
  }

  if (typeof document === "undefined") return false;

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "0";
  field.style.left = "-9999px";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  field.setSelectionRange(0, text.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(field);
  return copied;
}
