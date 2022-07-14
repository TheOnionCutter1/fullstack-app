import React, { useState, useEffect } from "react";
import "./App.css";

function App()
{
  const [backendData, setBackendData] = useState({ message: "" });

  useEffect(() =>
  {
    fetch("/api").then(
      response => response.json()
    ).then(
      data =>
      {
        setBackendData(data);
      }
    );
  }, []);
  console.log(backendData);

  return (
    <div className="App">
      {(typeof backendData.message == "undefined") ? (
        <p>Loading...</p>
      ) : (
        <p>{"Messasge: " + backendData.message}</p>
      )
      }
    </div>
  );
}

export default App;
