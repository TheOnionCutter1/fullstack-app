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

/**
 * Request the coin data from the Fixer.io api.
 * @returns A promise to the coin data.
 */
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
    .then(response => response.json())
    .then(requestResult => requestResult as CoinInfo)
    .catch(error =>
    {
      console.log("error", error);

      return errorResult;
    });
}

/**
 * Open the database and create the required table in it, if they do not exist.
 * @param callback A callback that receives the database object and will
 * be called when the database initialization is over.
 */
function openDatabase(callback: (db: sqlite.Database | null) => void)
{
  const db = new sqlite.Database(DB_PATH);
  const dbInitStatement = fs.readFileSync(DB_INIT_FILE);

  db.exec(dbInitStatement.toString(), (_) => callback(db));
}

/**
 * Insert data to the database.
 * @param db The database object.
 * @param data The data to insert.
 */
function writeDataToDatabase(db: sqlite.Database, data: CoinInfo)
{
  const statement = db.prepare("INSERT INTO CoinValue " +
    "(coin, entryDate, price) VALUES (?, ?, ?);");

  for (const date of Object.keys(data.rates))
  {
    for (const coin of Object.keys(data.rates[date]))
    {
      statement.run(coin, date, data.rates[date][coin]);
    }
  }
}

/**
 * Read all of the coin data from the database.
 * @param db The database object.
 * @param callback A callback that will be called
 * when the operation is completed.
 * The first parameter of the callback is a boolean that states whether the
 * database is empty.
 * The second parameter is the data that was read from the database.
 */
function getDataFromDatabase(db: sqlite.Database,
  callback: (empty: boolean, result: CoinInfo) => void)
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
  }, (_, count) => callback(count > 0, data));
}

export default function fetchCoinData()
{
  // TODO implement
}
