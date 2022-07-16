import express, { Request, Response } from "express";
import dotenv from "dotenv";

const APP = express();
const PORT = 8000;

dotenv.config();

APP.get("/api", (req: Request, res: Response) =>
{
  res.json({ message: "Express + TypeScript Server" });
});

APP.listen(PORT, () =>
{
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
