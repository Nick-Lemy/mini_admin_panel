import express from "express";
import { PORT } from "./configs/contants";
import { initializeDatabase } from "./configs/db";
import {
  createUserController,
  getUniqueUserByIdController,
  getUsersController,
  updateUserController,
} from "./features/user/user.controller";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/users", getUsersController);
app.post("/users", createUserController);
app.get("/users/:id", getUniqueUserByIdController);
app.put("/users/:id", updateUserController);
app.delete("/users/:id");

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
