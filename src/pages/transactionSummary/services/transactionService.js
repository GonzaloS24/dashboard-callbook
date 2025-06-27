export const transactionService = {
  async fetchTransactionDetails(transactionId, env) {
    try {
      if (!transactionId) {
        return null;
      }

      const apiUrl =
        env === "test"
          ? `https://sandbox.wompi.co/v1/transactions/${transactionId}`
          : `https://production.wompi.co/v1/transactions/${transactionId}`;

      const response = await fetch(apiUrl);
      const responseData = await response.json();

      if (responseData.data) {
        const transaction = responseData.data;
        const referenceData = this.parseReferenceString(transaction.reference);

        let cardType = null;
        if (
          transaction.payment_method_type === "CARD" &&
          transaction.payment_method?.extra?.card_type
        ) {
          cardType = transaction.payment_method.extra.card_type;
        }

        let amountUSD, amountCOP;

        if (transaction.currency === "COP") {
          amountCOP = transaction.amount_in_cents / 100;

          // Calcular USD usando tasa de cambio actual
          try {
            const exchangeResponse = await fetch(
              "https://api.exchangerate-api.com/v4/latest/USD"
            );
            if (exchangeResponse.ok) {
              const exchangeData = await exchangeResponse.json();
              const copRate = exchangeData.rates.COP;
              amountUSD = amountCOP / copRate;
            } else {
              amountUSD = amountCOP / 4000; // Fallback
            }
          } catch (error) {
            console.error("Error obteniendo tasa de cambio:", error);
            amountUSD = amountCOP / 4000; // Fallback
          }
        } else {
          amountUSD = transaction.amount_in_cents / 100;
          amountCOP = amountUSD * 4000;
        }

        return {
          id: transaction.id,
          status: transaction.status,
          statusMessage: this.getStatusMessage(transaction.status),
          reference: transaction.reference,
          amountUSD: amountUSD,
          amountCOP: amountCOP,
          currency: transaction.currency,
          createdAt: new Date(transaction.created_at).toLocaleString(),
          paymentMethod: transaction.payment_method_type,
          paymentMethodName: this.getPaymentMethodName(
            transaction.payment_method_type
          ),
          cardType,
          cardBrand: transaction.payment_method?.extra?.brand || null,
          cardLastFour: transaction.payment_method?.extra?.last_four || null,
          workspace_id: referenceData.workspace_id,
          minutes: parseInt(referenceData.minutes) || 0,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      return null;
    }
  },

  parseReferenceString(reference) {
    try {
      const result = {};
      const parts = reference.split("-");

      for (const part of parts) {
        if (part.includes("=")) {
          const [key, value] = part.split("=");
          if (key && value) {
            result[key] = value;
          }
        }
      }

      return result;
    } catch (e) {
      console.error("Error parsing reference:", e);
      return {};
    }
  },

  getStatusMessage(status) {
    switch (status) {
      case "APPROVED":
        return "¡Compra Exitosa!";
      case "DECLINED":
        return "Transacción Rechazada";
      case "VOIDED":
        return "Transacción Anulada";
      case "ERROR":
        return "Error en la Transacción";
      case "PENDING":
        return "Transacción en Proceso";
      default:
        return "Estado Desconocido";
    }
  },

  getPaymentMethodName(methodType) {
    switch (methodType) {
      case "CARD":
        return "";
      case "NEQUI":
        return "Nequi";
      case "PSE":
        return "PSE";
      case "BANCOLOMBIA_TRANSFER":
        return "Transferencia Bancolombia";
      case "BANCOLOMBIA_COLLECT":
        return "Recaudo Bancolombia";
      case "DAVIPLATA":
        return "Daviplata";
      default:
        return methodType;
    }
  },
};
