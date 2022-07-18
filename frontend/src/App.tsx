import React, { useState, useEffect } from "react";
import CoinInfo from "./CoinInfo";
import "./App.css";

function App()
{
  const [backendData, setBackendData] = useState<CoinInfo>({} as CoinInfo);

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
    </div>
  );
}

export default App;
