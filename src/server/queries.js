import pg from "pg";
import { config } from "dotenv";
const { Pool } = pg;

config();

export const pool = new Pool({
  host: process.env.DB_URL,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  user: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

export const findUser = async (sessionID) =>
  pool
    .query(
      `select
        keyboard.id,
        keyboard.color
      from
        keyboard
        join session on session.id = keyboard.session_id
      where
        active = true
        and keyboard.session_id = $1`,
      [sessionID],
    )
    .then((res) => res.rows[0])
    .catch((error) => new Error(error));

export const updateUserStatus = async (keyboardID, status) =>
  pool
    .query(
      `update
        keyboard
      set
        connected = $1
      where
        id = $2
      returning
        connected`,
      [status, keyboardID],
    )
    .then((res) => res.rows[0])
    .catch((error) => new Error(error));

export const updateUserColor = async (keyboardID, color) =>
  pool
    .query(
      `update
        keyboard
      set
        color = $1
      where
        id = $2
      returning
        color`,
      [color, keyboardID],
    )
    .then((res) => res.rows[0])
    .catch((error) => new Error(error));
