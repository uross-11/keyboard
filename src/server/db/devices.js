import { client } from "./client.js";

export class Devices {
  static async findOne(id) {
    const res = await client.query(
      `SELECT * FROM devices WHERE devices.id = $1 LIMIT 1`,
      [id],
    );
    return res.rows[0];
  }

  static async findAll() {
    const res = await client.query(`SELECT * FROM devices`);
    return res.rows;
  }

  static async updateColor(id, color) {
    const res = await client.query(
      `UPDATE devices SET color = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [color, id],
    );
    return res.rows[0];
  }

  static async updateConnected(id, connected) {
    const res = await client.query(
      `UPDATE devices SET connected = $1, updated_at = now() WHERE id = $2 RETURNING *`,
      [connected, id],
    );
    return res.rows[0];
  }

  static async insert({ connected = false, color = "green" }) {
    const res = await client.query(
      `INSERT INTO devices (connected, color) VALUES ($1, $2) RETURNING *`,
      [connected, color],
    );
    return res.rows[0];
  }
}
