import { useEffect, useRef, useState, useCallback } from "react";
import { wompiService } from "../../services/wompi/wompiService";

const WompiWidget = ({
  amountCOP,
  minutes,
  isVisible,
  onWidgetReady,
  onPaymentError,
  description = "Recarga de minutos",
}) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAmount, setCurrentAmount] = useState(null);
  const [currentMinutes, setCurrentMinutes] = useState(null);
  const debounceTimeoutRef = useRef(null);
  const isInitializingRef = useRef(false);

  const handleWidgetReady = useCallback(
    (success, reference) => {
      console.log("Widget ready:", { success, reference });
      onWidgetReady?.(success, reference);
    },
    [onWidgetReady]
  );

  const handlePaymentError = useCallback(
    (errorMessage) => {
      console.error("Payment error:", errorMessage);
      onPaymentError?.(errorMessage);
    },
    [onPaymentError]
  );

  const createWidget = useCallback(
    async (amount, minutesToRecharge) => {
      if (
        !containerRef.current ||
        !isVisible ||
        !amount ||
        amount <= 0 ||
        !minutesToRecharge ||
        minutesToRecharge <= 0 ||
        isInitializingRef.current
      ) {
        return;
      }

      isInitializingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        containerRef.current.innerHTML = "";

        // Remover scripts existentes de forma optimizada
        const existingScripts = document.querySelectorAll(
          'script[src*="widget.js"]'
        );
        existingScripts.forEach((script) => script.remove());

        // Crear datos de pago con la nueva estructura de referencia
        const paymentData = await wompiService.createPaymentData(
          amount,
          minutesToRecharge,
          description
        );

        // Crear widget
        const success = await wompiService.createPaymentWidget(
          containerRef.current,
          paymentData
        );

        if (success) {
          setCurrentAmount(amount);
          setCurrentMinutes(minutesToRecharge);
          handleWidgetReady(true, paymentData.reference);
        } else {
          throw new Error("Error al crear el widget de pago");
        }
      } catch (error) {
        console.error("Error al crear widget:", error);
        setError(error.message);
        handleWidgetReady(false);
        handlePaymentError(error.message);
      } finally {
        setIsLoading(false);
        isInitializingRef.current = false;
      }
    },
    [isVisible, description, handleWidgetReady, handlePaymentError]
  );

  // Effect con debounce
  useEffect(() => {
    if (
      !isVisible ||
      !amountCOP ||
      amountCOP <= 0 ||
      !minutes ||
      minutes <= 0
    ) {
      return;
    }

    // Si son los mismos datos, no hacer nada
    if (currentAmount === amountCOP && currentMinutes === minutes) {
      return;
    }

    // Limpiar timeout anterior
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Crear nuevo timeout con debounce
    debounceTimeoutRef.current = setTimeout(() => {
      createWidget(amountCOP, minutes);
    }, 150);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [
    amountCOP,
    minutes,
    isVisible,
    currentAmount,
    currentMinutes,
    createWidget,
  ]);

  // Effect para limpiar cuando se oculta el widget
  useEffect(() => {
    if (!isVisible) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      wompiService.cleanup();
      setError(null);
      setIsLoading(false);
      setCurrentAmount(null);
      setCurrentMinutes(null);
      isInitializingRef.current = false;
    }
  }, [isVisible]);

  // Effect para cleanup al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      wompiService.cleanup();
      isInitializingRef.current = false;
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="wompi-widget-container">
      {/* Mostrar estado de loading */}
      {isLoading && (
        <div className="flex items-center justify-center bg-[#009ee3] text-white rounded-lg p-2.5">
          <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-2"></div>
          <span className="text-sm font-medium">Cargando...</span>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="text-xs text-red-600 text-center p-2">{error}</div>
      )}

      {/* Widget container */}
      <div
        ref={containerRef}
        className={`wompi-widget-inline ${error ? "hidden" : ""} ${
          isLoading ? "hidden" : ""
        }`}
      />
    </div>
  );
};

export default WompiWidget;
