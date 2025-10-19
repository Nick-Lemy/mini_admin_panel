import express from "express";
import { PORT } from "./configs/contants";
import { initializeDatabase } from "./configs/db";
import userRouter from "./features/user/user.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);

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
