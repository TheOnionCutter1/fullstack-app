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

function writeDataToDatabase(data: CoinInfo)
{
  // TODO implement
}

function isDataInDatabase()
{
  // TODO implement
}

function getDataFromDatabase()
{
  // TODO implement
}

export default function fetchCoinData()
{
  // TODO implement
}
