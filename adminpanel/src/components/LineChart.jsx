// components/LineChart.jsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function LineChart({
  title,
  labels = [],
  data = [],
  color = "rgba(59,130,246,1)",
}) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        fill: false,
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 7,
          autoSkip: true,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-base-200 p-4 rounded-xl shadow-md h-72 overflow-hidden">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      <div className="w-full h-[calc(100%-2rem)] overflow-x-auto">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
