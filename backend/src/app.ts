import express from "express";
import cors from "cors";
import { PORT } from "./configs/contants";
import { initializeDatabase } from "./configs/db";
import userRouter from "./features/user/user.route";

const app = express();

// Configure CORS with specific options
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Content-Length"],
    credentials: true,
  })
);
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
