import { useState } from "react";
import DateRangeFilter from "../../components/dateRange/DateRangeFilter";
import MinutesChart from "../../components/charts/MinuteChart";

const Dashboard = () => {
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).toLocaleDateString("en-CA"),
    endDate: new Date().toLocaleDateString("en-CA"),
  });

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  const handleTotalMinutesChange = (total) => {
    setTotalMinutes(total);
  };

  return (
    <div className="min-h-screen bg-[#e4e9f7] p-5 max-sm:p-2">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-600 mb-10 mt-5">
          Dashboard de minutos
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:items-stretch">
          {/* Columna izquierda */}
          <div className="lg:col-span-1 flex flex-col space-y-6 lg:h-full">
            {/* Minutos disponibles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Minutos disponibles
              </h3>
              <p className="text-4xl font-bold text-[#009ee3]">5000</p>
            </div>

            {/* Total de llamadas hechas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Total de llamadas hechas
              </h3>
              <p className="text-4xl font-bold text-[#009ee3]">50</p>
            </div>

            {/* Total de llamadas hoy */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Total de llamadas hoy
              </h3>
              <p className="text-4xl font-bold text-[#009ee3]">5</p>
            </div>
          </div>

          {/* Columna derecha con el gráfico */}
          <div className="lg:col-span-3 lg:h-full">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col">
              {/* Header del gráfico */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Gráfico de minutos consumidos
                  </h3>
                  <div>
                    <DateRangeFilter
                      dateRange={dateRange}
                      onDateChange={handleDateRangeChange}
                    />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#009ee3] sm:text-right">
                  {totalMinutes.toLocaleString()}
                </div>
              </div>

              {/* Área del gráfico */}
              <div className="flex-1 min-h-[300px] sm:min-h-[400px] w-full">
                <MinutesChart
                  dateRange={dateRange}
                  onTotalMinutesChange={handleTotalMinutesChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
