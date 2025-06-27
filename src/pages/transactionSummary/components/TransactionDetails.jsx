export const TransactionDetails = ({ transactionData, onPrint }) => {
    
  const isSuccessful = transactionData?.status === "APPROVED";
  const isPending = transactionData?.status === "PENDING";

  const getCurrentDateFormatted = () => {
    const now = new Date();
    return now.toLocaleDateString() + " " + now.toLocaleTimeString();
  };

  return (
    <div
      className="transaction-details bg"
      data-print-date={getCurrentDateFormatted()}
    >
      <h4 className="details-title">Detalles de la compra</h4>

      <div className="transaction-info-grid">
        <div className="transaction-info-item">
          <div className="info-label">ID de Transacción</div>
          <div className="info-value">{transactionData.id}</div>
        </div>

        <div className="transaction-info-item">
          <div className="info-label">Estado</div>
          <div className="info-value">
            <span
              className={`status-badge ${
                isSuccessful ? "success" : isPending ? "pending" : "error"
              }`}
            >
              {transactionData.status}
            </span>
          </div>
        </div>

        <div className="transaction-info-item">
          <div className="info-label">Fecha</div>
          <div className="info-value">{transactionData.createdAt}</div>
        </div>

        <div className="transaction-info-item">
          <div className="info-label">Workspace ID</div>
          <div className="info-value">{transactionData.workspace_id}</div>
        </div>

        <div className="transaction-info-item">
          <div className="info-label">Minutos Adquiridos</div>
          <div className="info-value">
            <span className="minutes-badge">
              <i className="bx bx-time-five"></i>
              {transactionData.minutes.toLocaleString()} minutos
            </span>
          </div>
        </div>

        <div className="transaction-info-item">
          <div className="info-label">Monto</div>
          <div className="info-value amount-display">
            <div className="amount-value">
              <span>${transactionData.amountUSD.toFixed(2)}</span>
              <span className="currency-label">USD</span>
            </div>
            <div className="amount-divider">-</div>
            <div className="amount-value">
              <span>
                ${Math.round(transactionData.amountCOP).toLocaleString()}
              </span>
              <span className="currency-label">COP</span>
            </div>
          </div>
        </div>

        <div className="transaction-info-item">
          <div className="info-label">Método de Pago</div>
          <div className="info-value">
            {transactionData.paymentMethodName}
            {transactionData.paymentMethod === "CARD" && (
              <div className="card-details">
                {transactionData.cardBrand && (
                  <span className="card-brand">
                    {transactionData.cardBrand}
                  </span>
                )}
                {transactionData.cardLastFour && (
                  <span className="card-last-four">
                    **** {transactionData.cardLastFour}
                  </span>
                )}
                {transactionData.cardType && (
                  <span className="card-type-badge">
                    {transactionData.cardType === "CREDIT"
                      ? "Crédito"
                      : "Débito"}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="transaction-info-item">
          <div className="info-label">Precio por Minuto</div>
          <div className="info-value">
            ${(transactionData.amountUSD / transactionData.minutes).toFixed(4)}{" "}
            USD
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          className="btn-primary"
          onClick={() => (window.location.href = "/")}
        >
          Volver al dashboard
        </button>

        {isSuccessful && (
          <button className="btn-outline" onClick={onPrint}>
            <i className="bx bx-printer me-2"></i>
            Imprimir recibo
          </button>
        )}

        {isPending && (
          <button
            className="btn-outline"
            onClick={() => window.location.reload()}
          >
            <i className="bx bx-refresh me-2"></i>
            Actualizar estado
          </button>
        )}
      </div>
    </div>
  );
};
