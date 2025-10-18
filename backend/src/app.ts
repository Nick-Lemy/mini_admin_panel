import express, { type Request, type Response } from "express";
import { PORT } from "./utils/contants";
import "./utils/db";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
