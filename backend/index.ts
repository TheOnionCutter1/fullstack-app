import express, { Request, Response } from "express";
import dotenv from "dotenv";
import fetchCoinData from "./src/fetch";
import CoinInfo from "./src/CoinInfo";

const PORT = 8000;

const app = express();
let coinData: CoinInfo | null = null;

dotenv.config();
fetchCoinData((data) => coinData = data);

app.get("/api", (req: Request, res: Response) =>
{
  res.json({ message: "Express + TypeScript Server" });
});

app.get("/fetch", (req: Request, res: Response) =>
{
  res.json(coinData);
});

app.listen(PORT, () =>
{
  console.log(
    `Backend server is running at https://localhost:${PORT}`
  );
});
