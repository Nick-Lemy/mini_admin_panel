import express, { type Request, type Response } from "express";
import { PORT } from "./configs/contants";
import { initializeDatabase } from "./configs/db";
import {
  createUserController,
  getUsersController,
} from "./features/user/user.controller";
import bodyParser from "body-parser";

const app = express();

// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});
app.get("/users", getUsersController);
app.post("/users", createUserController);

async function startServer() {
  try {
    await import("./features/user/user.model");
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
