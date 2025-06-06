import pg from "pg";
import { config } from "dotenv";

config();

export const client = new pg.Client({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  // password: process.env.DB_PASS,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

await client.connect();
