// src/components/admin/ChartsSection.js
import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";
import {
  Line,
  Bar,
  Doughnut,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../../contexts/ThemeContext";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const ChartsSection = () => {
  const [chartType, setChartType] = useState("line");
  const [chartData, setChartData] = useState(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const mockData = {
      line: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Students",
            data: [65, 78, 85, 92, 88, 95],
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Revenue",
            data: [45, 52, 68, 75, 82, 88],
            borderColor: "rgb(245, 158, 11)",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      bar: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Attendance",
            data: [85, 92, 78, 96, 88, 75, 82],
            backgroundColor: "rgba(34, 197, 94, 0.8)",
          },
        ],
      },
      pie: {
        labels: ["Paid", "Pending", "Overdue"],
        datasets: [
          {
            data: [65, 25, 10],
            backgroundColor: [
              "rgba(34, 197, 94, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
            ],
            borderColor: darkMode
              ? ["#1f2937", "#1f2937", "#1f2937"]
              : ["#fff", "#fff", "#fff"],
            borderWidth: 2,
          },
        ],
      },
    };

    setChartData(mockData[chartType]);
  }, [chartType, darkMode]);

  const chartTypes = [
    { key: "line", label: "Line Chart", icon: FaChartLine },
    { key: "bar", label: "Bar Chart", icon: FaChartBar },
    { key: "pie", label: "Pie Chart", icon: FaChartPie },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? "#e5e7eb" : "#111827",
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#1f2937" : "#fff",
        titleColor: darkMode ? "#fff" : "#000",
        bodyColor: darkMode ? "#e5e7eb" : "#000",
        borderColor: darkMode ? "#374151" : "#e5e7eb",
        borderWidth: 1,
      },
    },
    scales:
      chartType !== "pie"
        ? {
            x: {
              ticks: { color: darkMode ? "#d1d5db" : "#374151" },
              grid: { color: darkMode ? "#374151" : "#e5e7eb" },
            },
            y: {
              ticks: { color: darkMode ? "#d1d5db" : "#374151" },
              grid: { color: darkMode ? "#374151" : "#e5e7eb" },
            },
          }
        : {},
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div>
          <h3 className="card-title">Analytics Dashboard</h3>
          <p className="card-description">
            Visual representation of hostel data
          </p>
        </div>
        <div className="flex space-x-2">
          {chartTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.key}
                onClick={() => setChartType(type.key)}
                className={`p-2 rounded-md transition-colors ${
                  chartType === type.key
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                title={type.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="card-content h-72 flex items-center justify-center">
        {chartData && (
          <>
            {chartType === "line" && (
              <Line data={chartData} options={chartOptions} />
            )}
            {chartType === "bar" && (
              <Bar data={chartData} options={chartOptions} />
            )}
            {chartType === "pie" && (
              <Doughnut data={chartData} options={chartOptions} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChartsSection;

