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
 * Genera una referencia detallada para la transacción
 * @param {string} workspaceId - ID del workspace
 * @param {number} minutes - Cantidad de minutos a recargar
 * @returns {string} - Referencia estructurada
 */
export function generateTransactionReference(workspaceId, minutes) {
  if (!workspaceId) {
    throw new Error("workspaceId es requerido para generar la referencia");
  }

  if (!minutes || minutes <= 0) {
    throw new Error("minutes debe ser un número positivo");
  }

  const timestamp = Date.now();

  return `workspace_id=${workspaceId}-minutes=${minutes}-timestamp=${timestamp}-type=RECARGA_MINUTOS`;
}

/**
 * Parsea una referencia estructurada y extrae sus componentes
 * @param {string} reference - Referencia a parsear
 * @returns {Object} - Objeto con los componentes de la referencia
 */
export function parseTransactionReference(reference) {
  try {
    const result = {};
    const parts = reference.split("-");

    for (const part of parts) {
      if (part.includes("=")) {
        const [key, value] = part.split("=");
        if (key && value) {
          // Convertir valores numéricos
          if (key === "minutes" || key === "timestamp") {
            result[key] = parseInt(value, 10);
          } else {
            result[key] = value;
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Error parseando referencia:", error);
    return {};
  }
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

/**
 * Obtiene el workspace ID
 * @returns {string} - Workspace ID
 */
export function getWorkspaceId() {
  // workspace id de ejemplo
  return "66666";
}
