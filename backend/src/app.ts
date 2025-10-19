import express, { type Request, type Response } from "express";
import { PORT } from "./utils/contants";
import { initializeDatabase } from "./utils/db";
import { getUsersController } from "./features/user.controller";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});
app.get("/users", getUsersController);

// Initialize database and start server
async function startServer() {
  try {
    // Import models and initialize database
    await import("./features/user.model");
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
