import { WOMPI_CONFIG } from "./wompiConfig";

/**
 * Genera la firma de integridad requerida por Wompi
 * @param {string} reference - Referencia única de la transacción
 * @param {number} amountInCents - Monto en centavos
 * @param {string} currency - Moneda (COP)
 * @returns {Promise<string>} - Firma de integridad
 */
export async function generateIntegritySignature(
  reference,
  amountInCents,
  currency
) {
  try {
    const validCurrency = currency && currency.trim() ? currency.trim() : "COP";

    if (!["COP", "USD"].includes(validCurrency)) {
      throw new Error(
        `Moneda inválida: ${validCurrency}. Solo se permiten COP y USD.`
      );
    }

    const concatenatedString = `${reference}${amountInCents}${validCurrency}${WOMPI_CONFIG.INTEGRITY_SECRET}`;

    console.log("Generando firma con:", {
      reference,
      amountInCents,
      currency: validCurrency,
      stringToHash: `${reference}${amountInCents}${validCurrency}[SECRET_HIDDEN]`,
    });

    // Convertir string a ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(concatenatedString);

    // Generar hash SHA256
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convertir ArrayBuffer a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    console.log("Firma generada:", hashHex);

    return hashHex;
  } catch (error) {
    console.error("Error generando firma de integridad:", error);
    return null;
  }
}

/**
 * Genera una referencia única para la transacción
 * @param {string} prefix - Prefijo para la referencia
 * @returns {string} - Referencia única
 */
export function generateTransactionReference(prefix = "RECARGA") {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Convierte pesos colombianos a centavos
 * @param {number} amountCOP - Monto en pesos colombianos
 * @returns {number} - Monto en centavos
 */
export function convertCOPToCents(amountCOP) {
  return Math.round(amountCOP * 100);
}

/**
 * Valida la configuración de Wompi
 * @returns {boolean} - True si la configuración es válida
 */
export function validateWompiConfig() {
  return !!(WOMPI_CONFIG.PUBLIC_KEY && WOMPI_CONFIG.INTEGRITY_SECRET);
}
