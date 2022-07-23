import React, { useState, useEffect, useMemo } from "react";
import CoinInfo from "./CoinInfo";
import "./App.css";
import displayGraphs from "./components/DisplayGraphs";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

function App()
{
  const [backendData, setBackendData] = useState<CoinInfo>({} as CoinInfo);
  const graphs = useMemo(
    () => displayGraphs({ data: backendData }), [backendData]
  );

  Chart.register(CategoryScale);

  useEffect(() =>
  {
    fetch("/fetch").then((response) => response.json())
      .then((data) =>
      {
        setBackendData(data);
      });
  }, []);
  document.body.style.backgroundColor = "#f5f0f0";

  return (
    <div>
      <span className="Heading">
        Investing Made Easy
      </span>
      {graphs}
    </div>
  );
}

export default App;
