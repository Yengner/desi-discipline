"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StudyChart({ stats }) {
  if (!Array.isArray(stats)) {
    return <p>Loading or no data available...</p>;
  }

  const labels = stats.map((entry) => entry.date);
  const hours = stats.map((entry) =>
    parseFloat((entry.total_study_time / 3600).toFixed(2))
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Study Time (hrs)",
        data: hours,
        backgroundColor: "rgba(216, 6, 62, 0.4)", // soft red tone
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const hrs = ctx.raw;
            const h = Math.floor(hrs);
            const m = Math.round((hrs - h) * 60);
            return `${h}h ${m}m`;
          },
        },
        backgroundColor: "#d8063e",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#fff",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: true, color: "#d8063e", width: 3 },
        ticks: { color: "#d8063e", font: { weight: "bold" } },
      },
      y: {
        grid: { display: false },
        border: { display: true, color: "#d8063e", width: 3 },
        ticks: {
          color: "#d8063e",
          font: { weight: "bold" },
          callback: (value) => `${value}h`,
        },
      },
    },
  };

  return (
    <div style={{ height: "300px", padding: "20px", backgroundColor: "#fde3c5", borderRadius: "20px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
