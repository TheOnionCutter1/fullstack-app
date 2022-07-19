import React from "react";
import { Line } from "react-chartjs-2";
import SingleCoinInfo from "../SingleCoinInfo";

export default function CoinGraph({ data }: { data: SingleCoinInfo })
{
  return (
    <div>
      <Line
        data={{
          labels: Object.keys(data.rates),
          datasets: [{
            label: data.coin,
            data: Object.values(data.rates),
            tension: 0.8
          }]
        }}
        height={300}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              // Disable the hide graph button
              onClick: () => void 0
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
