import React, { useState, useEffect, useMemo } from "react";
import CoinInfo from "./CoinInfo";
import "./App.css";
import displayGraphs from "./components/DisplayGraphs";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { ActionIcon } from "@mantine/core";
import * as Colors from "./Colors";

function App()
{
  const [backendData, setBackendData] = useState<CoinInfo>({} as CoinInfo);
  const [darkMode, setDarkMode] = useState(false);
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
  // Set the background color
  document.body.style.backgroundColor =
    Colors[darkMode ? "Dark" : "Light"].BACKGROUND;

  return (
    <div>
      <div className="Header">
        <img src="/logo.png" className="Logo" />
        <span className="Heading">
          Investing Made Easy
        </span>
      </div>

      <div className="Theme">
        <ActionIcon
          variant="transparent"
          onClick={() => setDarkMode(!darkMode)}>
          <img src={darkMode ? "/moon.png" : "/sun.png"} />
        </ActionIcon>
      </div>

      {graphs}
    </div>
  );
}

export default App;
