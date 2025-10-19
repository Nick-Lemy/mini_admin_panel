import { Sequelize } from "sequelize";
import { DB_HOST, DB_USER, DB_PASS, DB_NAME } from "./contants";

// Replace with your DB info
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false, // disable SQL logs
});

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    // Sync all models with database (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("Database tables synced!");
  } catch (err) {
    throw new Error(`Unable to connect: ${err}`);
  }
}

export default sequelize;
