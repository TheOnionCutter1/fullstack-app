import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/api", (req: Request, res: Response) =>
{
    res.json({ message: "Express + TypeScript Server" });
});

app.listen(port, () =>
{
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
