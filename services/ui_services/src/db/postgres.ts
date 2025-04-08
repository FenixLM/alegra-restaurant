import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
});

export const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log("Conectado a PostgreSQL");
    client.release();
  } catch (error) {
    console.error("Error conectando a PostgreSQL:", error);
    process.exit(1);
  }
};

export { pool };
