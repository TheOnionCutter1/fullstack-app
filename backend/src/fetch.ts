import sqlite from "sqlite3";
import fs from "fs";

const DB_PATH = `${__dirname}/../data/CoinDatabase.db`;
const DB_INIT_FILE = `${__dirname}/../data/DBinit.sql`;

const BASE_COIN = "USD";
const START_DATE = "2021-01-01";
const END_DATE = "2021-12-31";
const FETCH_URL = `https://api.apilayer.com/fixer/timeseries"
"?start_date=${START_DATE}&end_date=${END_DATE}&base=${BASE_COIN}`;

interface CoinInfo
{
  success: boolean;
  rates: {
    [date: string]: {
      [coin: string]: number
    }
  }
}

function requestData()
{
  const myHeaders = new Headers();
  const errorResult: CoinInfo = {
    success: false,
    rates: {}
  };

  if (process.env.API_KEY === undefined)
  {
    throw new Error("Please create a .env file and enter a Fixer.io API key");
  }
  myHeaders.append("apikey", process.env.API_KEY);

  const requestOptions: RequestInit = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders
  };

  return fetch(FETCH_URL,
    requestOptions)
    .then(response => response.text())
    .then(requestResult => JSON.parse(requestResult) as CoinInfo)
    .catch(error =>
    {
      console.log("error", error);

      return errorResult;
    });
}

function openDatabase()
{
  const db = new sqlite.Database(DB_PATH);
  const dbInitStatement = fs.readFileSync(DB_INIT_FILE);

  return db.exec(dbInitStatement.toString());
}

function writeDataToDatabase(db: sqlite.Database, data: CoinInfo)
{
  // TODO implement
}

function getDataFromDatabase(db: sqlite.Database,
  callback: (empty: boolean, result: CoinInfo) => unknown)
{
  const data: CoinInfo = {
    success: true,
    rates: {}
  };
  const statement = "SELECT * FROM CoinValue";

  db.each(statement, (err, row) =>
  {
    if (err)
    {
      data.success = false;
    }
    else
    {
      data.rates[row.entryDate][row.coin] = row.price;
    }
  },
  (_, count) => callback(count > 0, data));
}

export default function fetchCoinData()
{
  // TODO implement
}
