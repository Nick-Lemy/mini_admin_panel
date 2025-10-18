import dotenv from "dotenv";
dotenv.config();

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASS = process.env.DB_PASS || "";
export const DB_NAME = process.env.DB_NAME || "qtglobal";
export const PORT = process.env.PORT || 3000;
