import React from "react";
import { Line } from "react-chartjs-2";
import SingleCoinInfo from "../SingleCoinInfo";
import { ColorTheme } from "../Colors";

const GRAPH_COLOR = "#51cf66";

// Create a gradient color for the graph
const ctx = document.createElement("canvas").getContext("2d");
const gradient = ctx?.createLinearGradient(0, 0, 0, 400);

gradient?.addColorStop(0, GRAPH_COLOR + "66");
gradient?.addColorStop(1, GRAPH_COLOR + "00");

export default function coinGraph(data: SingleCoinInfo, colors: ColorTheme)
{
  return (
    <div>
      <Line
        data={{
          labels: Object.keys(data.rates),
          datasets: [{
            label: data.coin,
            data: Object.values(data.rates),
            fill: true,
            borderJoinStyle: "miter",
          }]
        }}
        height="300px"
        options={{
          maintainAspectRatio: false,
          borderColor: GRAPH_COLOR,
          backgroundColor: gradient,
          responsive: true,
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
          scales: {
            // Don't show the dates on the x axis
            x: { display: false },
            y: {
              ticks: { color: "#0" },
              grid: { color: colors.GRAPH_TICKS, borderColor: colors.GRAPH_TICKS }
            },
          }
        }}
      />
    </div>
  );
}
