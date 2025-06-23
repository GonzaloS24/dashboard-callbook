import { useState, useEffect } from "react";
import userLogo from "../../assets/user.png";

const getCallHistory = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const mockCalls = [
    {
      id: 1,
      name: "Gonzalo Salazar",
      email: "gonza@gmail.com",
      phoneNumber: "123456789",
      duration: "3 minutos",
      date: "2025-06-24",
      time: "14:30",
    },
    {
      id: 1,
      name: "Gonzalo Salazar",
      email: "gonza@gmail.com",
      phoneNumber: "123456789",
      duration: "3 minutos",
      date: "2025-06-24",
      time: "14:30",
    },
    {
      id: 1,
      name: "Gonzalo Salazar",
      email: "gonza@gmail.com",
      phoneNumber: "123456789",
      duration: "3 minutos",
      date: "2025-06-24",
      time: "14:30",
    },
    {
      id: 1,
      name: "Gonzalo Salazar",
      email: "gonza@gmail.com",
      phoneNumber: "123456789",
      duration: "3 minutos",
      date: "2025-06-24",
      time: "14:30",
    },
    {
      id: 1,
      name: "Gonzalo Salazar",
      email: "gonza@gmail.com",
      phoneNumber: "123456789",
      duration: "3 minutos",
      date: "2025-06-24",
      time: "14:30",
    },
    {
      id: 1,
      name: "Gonzalo Salazar",
      email: "gonza@gmail.com",
      phoneNumber: "123456789",
      duration: "3 minutos",
      date: "2025-06-24",
      time: "14:30",
    },
    {
      id: 1,
      name: "Gonzalo Salazar",
      email: "gonza@gmail.com",
      phoneNumber: "123456789",
      duration: "3 minutos",
      date: "2025-06-24",
      time: "14:30",
    },
    {
      id: 1,
      name: "Gonzalo Salazar",
      email: "gonza@gmail.com",
      phoneNumber: "123456789",
      duration: "3 minutos",
      date: "2025-06-24",
      time: "14:30",
    },
    {
      id: 1,
      name: "Gonzalo Salazar",
      email: "gonza@gmail.com",
      phoneNumber: "123456789",
      duration: "3 minutos",
      date: "2025-06-24",
      time: "14:30",
    },
  ];

  return mockCalls;
};

const CallHistory = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCallHistory = async () => {
      setLoading(true);
      try {
        const callData = await getCallHistory();
        setCalls(callData);
      } catch (error) {
        console.error("Error al obtener historial de llamadas:", error);
        setCalls([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCallHistory();
  }, []);

  // Calcular datos para paginación
  const totalPages = Math.ceil(calls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCalls = calls.slice(startIndex, endIndex);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Historial de llamadas
        </h3>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-[#009ee3] text-lg">
            Cargando historial...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Historial de llamadas
      </h3>

      {calls.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">
            No hay llamadas registradas
          </div>
          <p className="text-gray-500 text-sm">
            Las llamadas realizadas aparecerán aquí
          </p>
        </div>
      ) : (
        <>
          {/* Lista de llamadas */}
          <div className="space-y-4">
            {currentCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-4 bg-[#edf4ff] rounded-lg border border-[#009ee333] hover:bg-[#d0ecfc] transition-colors"
              >
                {/* Información del contacto */}
                <div className="flex items-center space-x-4 flex-1">
                  <img
                    src={userLogo}
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {call.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {call.email}
                        </p>
                        <p className="text-sm text-[#009ee3] font-medium">
                          {call.phoneNumber}
                        </p>
                      </div>

                      {/* Información de la llamada */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Duración: {call.duration}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(call.date)} - {call.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex + 1} a {Math.min(endIndex, calls.length)}{" "}
                de {calls.length} llamadas
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                      currentPage === index + 1
                        ? "bg-[#009ee3] text-white border-[#009ee3]"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CallHistory;
