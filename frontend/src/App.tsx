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
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("dark-mode") === "true"
  );
  const colors: Colors.ColorTheme = darkMode ? Colors.Dark : Colors.Light;
  const graphs = useMemo(
    () => displayGraphs(backendData, colors), [backendData, darkMode]
  );

  Chart.register(CategoryScale);
  localStorage.setItem("dark-mode", darkMode.toString());

  useEffect(() =>
  {
    fetch("/fetch").then((response) => response.json())
      .then((data) =>
      {
        setBackendData(data);
      }).catch(() => setBackendData({ success: false } as CoinInfo));
  }, []);
  // Set the background color
  document.body.style.backgroundColor = colors.BACKGROUND;

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
