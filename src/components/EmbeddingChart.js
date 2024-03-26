"use client";

import { Bubble } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ChartComponent = () => {
  const data = {
    datasets: [
      {
        label: "Bubble Chart Example",
        data: [
          { x: 10, y: 20, r: 35 }, // Example data point 1
          { x: 30, y: 40, r: 20 }, // Example data point 2
          { x: 50, y: 60, r: 15 }, // Example data point 3
          // Add more data points as needed
        ],
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Bubble color
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>Bubble Chart Example</h2>
      <Bubble data={data} />
    </div>
  );
};

export default ChartComponent;
