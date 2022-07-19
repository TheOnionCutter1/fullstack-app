import React from "react";
import CoinInfo from "../CoinInfo";
import SingleCoinInfo from "../SingleCoinInfo";
import CoinGraph from "./CoinGraph";

function RenderGraph({ data }: { data: CoinInfo })
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
    graphs.push(<><CoinGraph data={info} /><br /><br /></>);
  }

  return <>{graphs}</>;
}

export default function DisplayGraphs({ data }: { data: CoinInfo })
{
  if (data.success === undefined)
  {
    return <p>Loading...</p>;
  }
  else if (data.success === false)
  {
    return <p>An error occurred while retrieving data</p>;
  }
  else
  {
    return <RenderGraph data={data} />;
  }
}
