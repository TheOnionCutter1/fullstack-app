import { Loader } from "@mantine/core";
import React from "react";
import CoinInfo from "../CoinInfo";
import { ColorTheme } from "../Colors";
import SingleCoinInfo from "../SingleCoinInfo";
import coinGraph from "./CoinGraph";

function renderGraphs(data: CoinInfo, colors: ColorTheme)
{
  const dates = Object.keys(data.rates);
  const coins = Object.keys(data.rates[data.start_date])
    .filter((coin) => coin !== data.base);
  const info: SingleCoinInfo = {
    coin: "",
    rates: {}
  };
  const graphs: JSX.Element[] = [];

  for (const coin of coins)
  {
    info.coin = coin;
    for (const date of dates)
    {
      info.rates[date] = data.rates[date][info.coin];
    }
    graphs.push(
      <div key={graphs.length.toString()}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <h2 style={{
            textAlign: "center",
            display: "inline-block",
            padding: "3px",
            backgroundColor: "rgb(130, 130, 130)",
            borderRadius: "6px"
          }}>{coin}</h2>
        </div>

        <div key={"Chart Wrapper " + graphs.length.toString()}
          style={{
            position: "relative",
            height: "300px",
            marginLeft: "10%",
            marginRight: "10%",
            marginBottom: "20vh"
          }}>
          {coinGraph(info, colors)}
        </div>
      </div>
    );
  }

  return graphs;
}

export default function displayGraphs(data: CoinInfo, colors: ColorTheme)
{
  if (data.success === undefined)
  {
    return <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      marginTop: "10vh"
    }}>
      <Loader color="cyan" size="xl" />
    </div>;
  }
  else if (data.success === false)
  {
    return <h1 style={{ textAlign: "center" }}>
      An error occurred while retrieving data
    </h1>;
  }
  else
  {
    return renderGraphs(data, colors);
  }
}
