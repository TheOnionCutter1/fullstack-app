import fs from "fs";
import CoinInfo from "./CoinInfo";
import fetch from "node-fetch";

// The runtime files will be at the "dist" directory
const DB_PATH = `${__dirname}/../../data/CoinData.json`;

const BASE_COIN = "USD";
const START_DATE = "2021-01-01";
const END_DATE = "2021-12-31";
const FETCH_URL = `https://api.apilayer.com/fixer/timeseries
?start_date=${START_DATE}&end_date=${END_DATE}&base=${BASE_COIN}`;

/**
 * Request the coin data from the Fixer.io api.
 * @returns A promise to the coin data.
 */
async function requestData()
{
  let result: CoinInfo = {
    success: false,
    start_date: "",
    end_date: "",
    base: "",
    rates: {}
  };

  if (process.env.API_KEY === undefined)
  {
    throw new Error(
      "Please create a .env file and enter a Fixer.io API key under the API_KEY field"
    );
  }

  try
  {
    // TODO Remove print debugging
    console.log("REQUESTING FROM API");
    const response = await fetch(FETCH_URL, {
      method: "GET",
      redirect: "follow",
      headers: {
        apikey: process.env.API_KEY
      }
    });

    result = await response.json() as CoinInfo;
  } catch (error)
  {
    console.error("Error while fetching data from Fixer.io:", error);
  }

  return result;
}

function getLocalData(callback: (data: CoinInfo | null) => void)
{
  // Create the file if it does not exist
  fs.open(DB_PATH, "a+", (err, fd) =>
  {
    if (err)
    {
      throw err;
    }

    fs.close(fd);
    fs.readFile(DB_PATH, (err, data) =>
    {
      if (err)
      {
        throw err;
      }

      if (data.length === 0)
      {
        callback(null);
      }
      else
      {
        callback(JSON.parse(data.toString()) as CoinInfo);
      }
    });
  });
}

function saveDataToLocalFile(data: CoinInfo)
{
  fs.writeFileSync(DB_PATH, JSON.stringify(data));
}

/**
 * Fetch the coin data.
 * If any data is present at the database, fetch from it.
 * Otherwise, fetch from the Fixer.io api and write the result to the database.
 * @param callback A callback function that is called when the data is fetched
 * and receives it as a parameter.
 */
export default function fetchCoinData(callback: (data: CoinInfo) => void)
{
  getLocalData((data) =>
  {
    if (data)
    {
      callback(data);
    }
    else
    {
      requestData().then((data) =>
      {
        callback(data);
        saveDataToLocalFile(data);
      });
    }
  });
}
