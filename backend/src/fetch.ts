import fs from "fs";
import CoinInfo from "./CoinInfo";
import fetch from "node-fetch";

// The runtime files will be at the "dist" directory
const DB_DIR = `${__dirname}/../../data`;
const DB_PATH = `${DB_DIR}/CoinData.json`;
const DATE_LENGTH = "YYYY-MM-DD".length;

const BASE_COIN = "USD";
const START_DATE = "2021-01-01";
const END_DATE = "2021-12-31";
const SYMBOLS = ["BTC", "ETH", "ADA"];
const LIMIT = 365;
const FETCH_URL = `https://rest.coinapi.io/v1/exchangerate/
SYMBOL/${BASE_COIN}/history?
period_id=1DAY&time_start=${START_DATE}&time_end=${END_DATE}&limit=${LIMIT}`;

type ReturnedResult = {
  time_period_start: string;
  rate_open: number;
}[] | { error: string };

/**
 * Request the coin data from the CoinAPI API.
 * @returns A promise to the coin data.
 */
async function requestData()
{
  const result: CoinInfo = {
    success: false,
    start_date: START_DATE,
    end_date: END_DATE,
    base: BASE_COIN,
    rates: {}
  };

  if (process.env.API_KEY === undefined)
  {
    throw new Error(
      "Please create a .env file and enter an API key under the API_KEY field"
    );
  }

  try
  {
    for (const coin of SYMBOLS)
    {
      const url = FETCH_URL.replace("SYMBOL", coin);
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: {
          "X-CoinAPI-Key": process.env.API_KEY
        }
      });
      const returned = await response.json() as ReturnedResult;

      // Check for success
      if (Array.isArray(returned))
      {
        result.success = true;
        for (const data of returned)
        {
          const date = data.time_period_start.slice(0, DATE_LENGTH);

          if (result.rates[date] === undefined)
          {
            result.rates[date] = {};
          }

          result.rates[date][coin] = data.rate_open;
        }
      }
      else
      {
        console.error("CoinAPI returned an error: ", returned.error);

        break;
      }
    }
  } catch (error)
  {
    throw new Error("Error while fetching data from CoinAPI: " + error);
  }

  return result;
}

/**
 * Get the data from the local database.
 * @param callback A callback function that will be called
 * when the data is retrieved.
 * If the database is empty, the parameter of the function is null.
 * If the database is not empty,
 * the function receives the retrieved data as a parameter.
 */
function getLocalData(callback: (data: CoinInfo | null) => void)
{
  // Create the file's directory if it does not exists
  if (!fs.existsSync(DB_DIR))
  {
    fs.mkdirSync(DB_DIR);
  }
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
      console.log("Data was retrieved from the local database");
      callback(data);
    }
    else
    {
      console.log("Requesting data from CoinAPI...");
      requestData().then((data) =>
      {
        callback(data);
        console.log("Data was retrieved successfully from CoinAPI");
        if (data.success)
        {
          fs.writeFileSync(DB_PATH, JSON.stringify(data));
        }
      });
    }
  });
}
