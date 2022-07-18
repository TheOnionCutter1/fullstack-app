import sqlite from "sqlite3";
import fs from "fs";
import CoinInfo from "./CoinInfo";

// The runtime files will be at the "dist" directory
const DB_PATH = `${__dirname}/../../data/CoinDatabase.db`;
const DB_INIT_FILE = `${__dirname}/../../data/DBinit.sql`;

const BASE_COIN = "USD";
const START_DATE = "2021-01-01";
const END_DATE = "2021-12-31";
const FETCH_URL = `https://api.apilayer.com/fixer/timeseries"
"?start_date=${START_DATE}&end_date=${END_DATE}&base=${BASE_COIN}`;

/**
 * Request the coin data from the Fixer.io api.
 * @returns A promise to the coin data.
 */
async function requestData()
{
  const myHeaders = new Headers();
  let result: CoinInfo = {
    success: false,
    rates: {}
  };

  if (process.env.API_KEY === undefined)
  {
    throw new Error(
      "Please create a .env file and enter a Fixer.io API key under the API_KEY field"
    );
  }
  myHeaders.append("apikey", process.env.API_KEY);

  const requestOptions: RequestInit = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders
  };

  try
  {
    const response = await fetch(FETCH_URL, requestOptions);
    const requestResult = await response.json();

    // TODO Remove print debugging
    console.log(requestResult);

    result = requestResult;
  } catch (error)
  {
    console.error("Error while fetching data from Fixer.io:", error);
  }

  return result;
}

/**
 * Open the database and create the required table in it, if they do not exist.
 * @param callback A callback that receives the database object and will
 * be called when the database initialization is over.
 */
function openDatabase(callback: (db: sqlite.Database) => void)
{
  const db = new sqlite.Database(DB_PATH);

  fs.readFile(DB_INIT_FILE, (err, dbInitStatement) =>
  {
    if (err)
    {
      throw new Error(
        "Reading the database initialization file has failed: " + err.message
      );
    }
    db.exec(dbInitStatement.toString(), (err) =>
    {
      if (err)
      {
        throw err;
      }
      callback(db);
    });
  });
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

  // Write the changes in serialized mode
  // so the queries will run one by one
  db.serialize(() =>
  {
    db.run("BEGIN;");
    for (const date of Object.keys(data.rates))
    {
      for (const coin of Object.keys(data.rates[date]))
      {
        statement.run([coin, date, data.rates[date][coin]], (err) =>
        {
          if (err)
          {
            db.run("ROLLBACK;");
            throw new Error("Writing to the database has failed");
          }
        });
      }
    }
    db.run("COMMIT;");
  });
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
  }, (_, count) => callback(count === 0, data));
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
  openDatabase((db) =>
  {
    getDataFromDatabase(db, (empty, data) =>
    {
      if (empty)
      {
        requestData().then((result) => callback(result));
      }
      else
      {
        callback(data);
        writeDataToDatabase(db, data);
      }
    });
  });
}
