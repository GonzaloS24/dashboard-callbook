import { useState } from "react";

const RechargePopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    minutes: "1",
    promo_code: ""
  });

  const [loading, setLoading] = useState(false);

  // Constantes
  const PRICE_PER_MINUTE = 1000;
  const WORKSPACE_ID = 192535;
  const CURRENCY = "COP";
  const METHOD = "wompi";

  // Cálculos
  const minutes = parseInt(formData.minutes) || 0;
  const seconds = minutes * 60;
  const totalAmount = minutes * PRICE_PER_MINUTE;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        workspace_id: WORKSPACE_ID,
        seconds_amount: seconds,
        amount: totalAmount,
        currency: CURRENCY,
        method: METHOD,
        promo_code: formData.promo_code || undefined
      };

      console.log("Datos de recarga:", dataToSend);
      
      // Simular delay de la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      onClose();
      
      // Reset form
      setFormData({
        minutes: "1",
        promo_code: ""
      });
      
    } catch (error) {
      console.error("Error al recargar minutos:", error);
    } finally {
      setLoading(false);
    }
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
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md mx-auto bg-white p-6 rounded-2xl  shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-600">
            Recargar minutos
          </h2>
          <button
            type="button"
            onClick={onClose}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            />
          </div>

          {/* Resumen de compra */}
          {minutes > 0 && (
            <div className="bg-[#edf4ff] border border-[#009ee333] rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Resumen de compra
              </h3>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Minutos a comprar:</span>
                <span className="text-sm font-medium text-gray-900">
                  {minutes.toLocaleString()} minutos
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Precio por minuto:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${PRICE_PER_MINUTE.toLocaleString()} COP
                </span>
              </div>
              
              <div className="border-t border-[#009ee333] pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-700">Total a pagar:</span>
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
            />
          </div>

          {/* Método de pago info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
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
                Pago seguro procesado por <span className="font-medium text-[#009ee3]">Wompi</span>
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || minutes === 0}
              className="flex-1 text-white bg-[#009ee3] hover:bg-[#007bb8] focus:ring-2 focus:ring-[#009ee3]/50 focus:outline-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg text-sm px-4 py-2.5 text-center transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                `Pagar $${totalAmount.toLocaleString()} COP`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RechargePopup;