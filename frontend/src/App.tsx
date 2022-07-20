import React, { useState, useEffect } from "react";
import CoinInfo from "./CoinInfo";
import "./App.css";
import DisplayGraphs from "./components/DisplayGraphs";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

function App()
{
  const [backendData, setBackendData] = useState<CoinInfo>({} as CoinInfo);

  Chart.register(CategoryScale);

  useEffect(() =>
  {
    fetch("/fetch").then((response) => response.json())
      .then((data) =>
      {
        setBackendData(data);
      });
  }, []);

  return (
    <div className="App">
      <span className="Heading">
        Investing Made Easy.
      </span>
      {DisplayGraphs({ data: backendData })}
    </div>
  );
}

export default App;
