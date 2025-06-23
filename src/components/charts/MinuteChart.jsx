/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Función para simular datos de API
const getMinutesByDateRange = async (startDate, endDate) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generar datos simulados de minutos consumidos
  const start = new Date(startDate);
  const end = new Date(endDate);
  const mockData = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const minutes = Math.floor(Math.random() * 450) + 50;
    mockData.push({
      date: new Date(d).toISOString().split("T")[0],
      minutes: minutes,
    });
  }

  return mockData;
};

const MinutesChart = ({ dateRange, onTotalMinutesChange }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Minutos Consumidos",
        data: [],
        borderColor: "#009ee3",
        backgroundColor: "rgba(0, 158, 227, 0.2)",
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#009ee3",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fullDates: [],
      },
    ],
  });

  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMinutesData = async () => {
      setLoading(true);
      try {
        const minutesData = await getMinutesByDateRange(
          dateRange.startDate,
          dateRange.endDate
        );
        processChartData(minutesData);
      } catch (error) {
        console.error("Error al obtener datos de minutos:", error);
        processChartData([]);
        setLoading(false);
      }
    };

    if (dateRange?.startDate && dateRange?.endDate) {
      fetchMinutesData();
    }
  }, [dateRange]);

  const processChartData = (minutesData) => {
    const runningTotal =
      minutesData && minutesData.length > 0
        ? minutesData.reduce((sum, item) => sum + item.minutes, 0)
        : 0;

    // Enviar el total al componente padre
    if (onTotalMinutesChange) {
      onTotalMinutesChange(runningTotal);
    }

    if (!minutesData || minutesData.length === 0) {
      setChartData({
        labels: [],
        datasets: [
          {
            label: "Minutos Consumidos",
            data: [],
            borderColor: "#009ee3",
            backgroundColor: "rgba(0, 158, 227, 0.2)",
            tension: 0.3,
            fill: true,
            borderWidth: 2,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#009ee3",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            fullDates: [],
          },
        ],
      });

      setOptions(getChartOptions([]));
      setLoading(false);
      return;
    }

    minutesData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = minutesData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      });
    });

    const values = minutesData.map((item) => item.minutes);

    const fullDates = minutesData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("es-ES");
    });

    setChartData({
      labels,
      datasets: [
        {
          label: "Minutos Consumidos",
          data: values,
          borderColor: "#009ee3",
          backgroundColor: "rgba(0, 158, 227, 0.2)",
          tension: 0.3,
          fill: true,
          borderWidth: 2,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#009ee3",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fullDates: fullDates,
        },
      ],
    });

    setOptions(getChartOptions(minutesData));
    setLoading(false);
  };

  const getChartOptions = (minutesData) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category",
          title: {
            display: true,
            text: "Fecha",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 45,
            autoSkip: true,
            maxTicksLimit:
              minutesData.length > 20 ? 20 : Math.max(minutesData.length, 1),
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Minutos",
            font: {
              size: 14,
              weight: "bold",
            },
          },
          ticks: {
            callback: function (value) {
              return value + " min";
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 15,
            usePointStyle: true,
            pointStyle: "circle",
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            title: function (context) {
              const dataIndex = context[0].dataIndex;
              const dataset = chartData.datasets[0];
              return dataset.fullDates && dataset.fullDates.length > dataIndex
                ? dataset.fullDates[dataIndex]
                : "";
            },
            label: function (context) {
              return "Minutos: " + context.parsed.y + " min";
            },
          },
        },
      },
    };
  };

  return (
    <div className="w-full h-full">
      {loading ? (
        <div className="flex justify-center items-center h-full text-[#009ee3] text-lg">
          <div className="animate-pulse">Cargando...</div>
        </div>
      ) : (
        <div className="h-full w-full">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default MinutesChart;
