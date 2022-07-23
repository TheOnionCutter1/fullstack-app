import React from "react";
import { Line } from "react-chartjs-2";
import SingleCoinInfo from "../SingleCoinInfo";

export default function coinGraph(data: SingleCoinInfo)
{
  return (
    <div>
      <Line
        data={{
          labels: Object.keys(data.rates),
          datasets: [{
            label: data.coin,
            data: Object.values(data.rates),
          }]
        }}
        options={{
          maintainAspectRatio: false,
          borderColor: "#51cf66",
          elements: {
            point: {
              // Hide the points in the graph
              radius: 0
            }
          },
          plugins: {
            tooltip: {
              // Show the tooltip when hovering anywhere
              intersect: false,
              // Show the data in the tooltip based on the mouse's position
              // in the x axis only
              axis: "x"
            },
            legend: {
              // Disable the hide graph button
              display: false,
            }
          },
          // Don't show the dates on the x axis
          scales: {
            x: {
              display: false
            }
          }
        }}
      />
    </div>
  );
}
