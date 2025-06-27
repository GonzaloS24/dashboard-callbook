import { WOMPI_CONFIG } from "./wompiConfig";
import {
  generateIntegritySignature,
  generateTransactionReference,
  convertCOPToCents,
  validateWompiConfig,
  getWorkspaceId,
} from "./wompiHelper";

export class WompiService {
  constructor() {
    this.scriptLoaded = false;
    this.currentReference = null;
  }

  /**
   * Crea los datos de pago necesarios para Wompi
   * @param {number} amountCOP - Monto en pesos colombianos
   * @param {number} minutes - Cantidad de minutos a recargar
   * @param {string} description - Descripción del pago
   * @returns {Promise<Object>} - Datos de pago para Wompi
   */
  async createPaymentData(
    amountCOP,
    minutes,
    description = "Recarga de minutos"
  ) {
    try {
      if (!validateWompiConfig()) {
        throw new Error("Configuración de Wompi inválida");
      }

      // Validar parámetros
      if (!amountCOP || amountCOP <= 0) {
        throw new Error("El monto debe ser mayor a 0");
      }

      if (!minutes || minutes <= 0) {
        throw new Error("La cantidad de minutos debe ser mayor a 0");
      }

      const workspaceId = getWorkspaceId();
      const reference = generateTransactionReference(workspaceId, minutes);
      const amountInCents = convertCOPToCents(amountCOP);
      const currency = WOMPI_CONFIG.CURRENCY;

      console.log("Creando datos de pago:", {
        reference,
        amountCOP,
        minutes,
        amountInCents,
        currency,
        workspaceId,
      });

      const signature = await generateIntegritySignature(
        reference,
        amountInCents,
        currency
      );

      if (!signature) {
        throw new Error("Error generando firma de integridad");
      }

      this.currentReference = reference;

      return {
        reference,
        amountCOP,
        minutes,
        amountInCents,
        currency,
        signature,
        description,
        publicKey: WOMPI_CONFIG.PUBLIC_KEY,
      };
    } catch (error) {
      console.error("Error creando datos de pago:", error);
      throw error;
    }
  }

  /**
   * Crea el widget de pago de Wompi en el contenedor especificado
   * @param {HTMLElement} container - Contenedor donde se insertará el widget
   * @param {Object} paymentData - Datos de pago obtenidos de createPaymentData
   * @returns {Promise<boolean>} - True si el widget se creó exitosamente
   */
  async createPaymentWidget(container, paymentData) {
    try {
      if (!container || !paymentData) {
        throw new Error("Contenedor o datos de pago no válidos");
      }

      // Limpiar contenedor
      container.innerHTML = "";
      this.removeExistingScripts();

      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/transaction-summary`;

      const script = this.createWompiScript({
        ...paymentData,
        redirectUrl,
      });

      container.appendChild(script);

      await this.waitForScriptLoad(script);

      return true;
    } catch (error) {
      console.error("Error creando widget de Wompi:", error);
      return false;
    }
  }

  /**
   * Crea el elemento script con la configuración de Wompi
   * @param {Object} config - Configuración del widget
   * @returns {HTMLScriptElement} - Elemento script configurado
   */
  createWompiScript(config) {
    console.log("Creando script de Wompi con config:", config);

    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.setAttribute("data-render", "button");
    script.setAttribute("data-public-key", config.publicKey);
    script.setAttribute("data-currency", config.currency);
    script.setAttribute(
      "data-amount-in-cents",
      config.amountInCents.toString()
    );
    script.setAttribute("data-reference", config.reference);
    script.setAttribute("data-signature:integrity", config.signature);
    script.setAttribute("data-redirect-url", config.redirectUrl);

    // Texto personalizado del botón
    script.setAttribute(
      "data-button-text",
      `Pagar ${config.amountCOP.toLocaleString()} COP`
    );
    script.setAttribute("data-button-class", "wompi-payment-button");

    // Log para debugging
    console.log("Atributos del script:", {
      "data-currency": script.getAttribute("data-currency"),
      "data-amount-in-cents": script.getAttribute("data-amount-in-cents"),
      "data-reference": script.getAttribute("data-reference"),
      "data-public-key": script.getAttribute("data-public-key"),
    });

    return script;
  }

  /**
   * Espera a que el script de Wompi se cargue completamente
   * @param {HTMLScriptElement} script - Elemento script
   * @returns {Promise<void>}
   */
  waitForScriptLoad(script) {
    return new Promise((resolve, reject) => {
      let timeoutId;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
      };

      script.onload = () => {
        cleanup();
        this.scriptLoaded = true;
        console.log("Script de Wompi cargado exitosamente");
        resolve();
      };

      script.onerror = (error) => {
        cleanup();
        console.error("Error cargando script de Wompi:", error);
        reject(new Error("Error cargando script de Wompi"));
      };

      // Timeout después de 15 segundos
      timeoutId = setTimeout(() => {
        cleanup();
        if (!this.scriptLoaded) {
          console.error("Timeout cargando script de Wompi");
          reject(
            new Error(
              "Timeout cargando script de Wompi. Verifica tu conexión a internet."
            )
          );
        }
      }, 15000);
    });
  }

  /**
   * Remueve scripts existentes de Wompi para evitar conflictos
   */
  removeExistingScripts() {
    const existingScripts = document.querySelectorAll(
      'script[src="https://checkout.wompi.co/widget.js"]'
    );
    existingScripts.forEach((script) => script.remove());
    this.scriptLoaded = false;
  }

  /**
   * Obtiene la referencia actual de la transacción
   * @returns {string|null} - Referencia actual
   */
  getCurrentReference() {
    return this.currentReference;
  }

  /**
   * Verifica si Wompi está configurado correctamente
   * @returns {boolean} - True si está configurado
   */
  isConfigured() {
    return validateWompiConfig();
  }

  /**
   * Limpia los datos de la transacción actual
   */
  cleanup() {
    console.log("Limpiando recursos de Wompi...");

    // Limpiar contenedores
    const containers = document.querySelectorAll(
      "#wompi-widget-container, .wompi-widget-inline"
    );
    containers.forEach((container) => {
      if (container) {
        container.innerHTML = "";
      }
    });

    this.removeExistingScripts();
    this.currentReference = null;
    this.scriptLoaded = false;
  }
}

// Exportar instancia singleton
export const wompiService = new WompiService();
