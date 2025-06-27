import { useState, useCallback } from "react";
import WompiWidget from "../wompi/WompiWidget";
import { PRICE_PER_MINUTE } from "../../utils/constants";

const RechargePopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    minutes: "1",
    promo_code: "",
  });

  const [showWompiWidget, setShowWompiWidget] = useState(false);
  const [paymentReference, setPaymentReference] = useState(null);
  const [widgetError, setWidgetError] = useState(null);

  // Cálculos
  const minutes = parseInt(formData.minutes) || 0;
  const totalAmount = minutes * PRICE_PER_MINUTE;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Ocultar widget si cambia la cantidad
    if (name === "minutes") {
      setShowWompiWidget(false);
      setPaymentReference(null);
      setWidgetError(null);
    }
  };

  const handleShowPayment = useCallback(() => {
    console.log("Mostrando widget de pago para:", { minutes, totalAmount });

    if (minutes > 0) {
      setWidgetError(null);
      setPaymentReference(null);
      setShowWompiWidget(true);
    } else {
      alert("Por favor, selecciona una cantidad válida de minutos");
    }
  }, [minutes, totalAmount]);

  const handleWompiWidgetReady = useCallback((success, reference) => {
    console.log("Widget ready callback:", { success, reference });

    if (success) {
      setPaymentReference(reference);
      setWidgetError(null);
    } else {
      console.error("Error al cargar el widget de Wompi");
      setWidgetError("No se pudo cargar el método de pago");
      setShowWompiWidget(false);
    }
  }, []);

  const handlePaymentError = useCallback((error) => {
    console.error("Error en el pago:", error);
    setWidgetError(error);
    setShowWompiWidget(false);
    alert("Error al procesar el pago. Por favor, intenta nuevamente.");
  }, []);

  const handleClose = () => {
    setShowWompiWidget(false);
    setPaymentReference(null);
    setWidgetError(null);
    setFormData({
      minutes: "1",
      promo_code: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-600">Recargar minutos</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Cantidad de minutos */}
          <div>
            <label
              htmlFor="minutes"
              className="block mb-2 text-sm font-medium text-gray-400"
            >
              ¿Cuántos minutos deseas comprar?
            </label>
            <input
              type="number"
              id="minutes"
              name="minutes"
              value={formData.minutes}
              onChange={handleInputChange}
              className="bg-[#edf4ff] border border-[#009ee333] text-gray-900 text-sm rounded-lg focus:outline-none focus:border-[#009ee3] focus:ring-2 focus:ring-[#009ee3]/20 transition-all duration-200 block w-full p-2.5"
              placeholder="Ej: 30"
              required
              min="1"
              disabled={showWompiWidget}
            />
          </div>

          {/* Resumen de compra */}
          {minutes > 0 && (
            <div className="bg-[#edf4ff] border border-[#009ee333] rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Resumen de compra
              </h3>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Minutos a comprar:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {minutes.toLocaleString()} minutos
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Precio por minuto:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  ${PRICE_PER_MINUTE.toLocaleString()} COP
                </span>
              </div>

              <div className="border-t border-[#009ee333] pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-700">
                    Total a pagar:
                  </span>
                  <span className="text-lg font-bold text-[#009ee3]">
                    ${totalAmount.toLocaleString()} COP
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Código promocional (opcional) */}
          <div>
            <label
              htmlFor="promo_code"
              className="block mb-2 text-sm font-medium text-gray-400"
            >
              Código promocional (opcional)
            </label>
            <input
              type="text"
              id="promo_code"
              name="promo_code"
              value={formData.promo_code}
              onChange={handleInputChange}
              className="bg-[#edf4ff] border border-[#009ee333] text-gray-900 text-sm rounded-lg focus:outline-none focus:border-[#009ee3] focus:ring-2 focus:ring-[#009ee3]/20 transition-all duration-200 block w-full p-2.5"
              placeholder="Ingresa tu código"
              disabled={showWompiWidget}
            />
          </div>

          {/* Método de pago info */}
          {!showWompiWidget && (
            <div className=" rounded-lg px-3">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-[#009ee3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  Pago seguro procesado por{" "}
                  <span className="font-medium text-[#009ee3]">Wompi</span>
                </span>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
            >
              Cancelar
            </button>

            {!showWompiWidget && (
              <button
                type="button"
                onClick={handleShowPayment}
                disabled={minutes === 0}
                className="flex-1 text-white bg-[#009ee3] hover:bg-[#007bb8] focus:ring-2 focus:ring-[#009ee3]/50 focus:outline-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg text-sm px-4 py-2.5 text-center transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Continuar con el pago
              </button>
            )}
            {/* Widget de Wompi */}
            {showWompiWidget && (
              <div>
                {/* Error del widget */}
                {widgetError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex">
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="ml-2">
                        <p className="text-sm text-red-800">
                          Error al cargar el método de pago
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          {widgetError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <WompiWidget
                  amountCOP={totalAmount}
                  minutes={minutes}
                  isVisible={true}
                  onWidgetReady={handleWompiWidgetReady}
                  onPaymentError={handlePaymentError}
                  description={`Recarga de ${minutes} minutos`}
                />
              </div>
            )}
          </div>

          {/* Información adicional */}
          {paymentReference && (
            <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
              Referencia: {paymentReference}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RechargePopup;
