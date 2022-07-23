import { Loader } from "@mantine/core";
import React from "react";
import CoinInfo from "../CoinInfo";
import SingleCoinInfo from "../SingleCoinInfo";
import coinGraph from "./CoinGraph";

function renderGraphs(data: CoinInfo)
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
        <h3 style={{
          textAlign: "center",
        }}><u>{coin}</u></h3>
        <div key={"Chart Wrapper " + graphs.length.toString()}
          style={{
            position: "relative",
            height: "300px",
            marginLeft: "10%",
            marginRight: "10%",
            marginBottom: "20vh"
          }}>
          {coinGraph(info)}
        </div>
      </div>
    );
  }
  // Remove margin for the last element
  graphs[graphs.length - 1].props.children[1].props.style.marginBottom = 0;

  return graphs;
}

export default function displayGraphs({ data }: { data: CoinInfo })
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
    return <p>An error occurred while retrieving data</p>;
  }
  else
  {
    return renderGraphs(data);
  }
}
