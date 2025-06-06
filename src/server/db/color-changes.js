import { client } from "./client.js";

export class ColorChanges {
  static async insert(deviceId, color, changedBy = null) {
    try {
      const res = await client.query(
        `INSERT INTO color_changes (device_id, color, changed_by)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [deviceId, color, changedBy],
      );
      return res.rows[0];
    } catch (err) {
      console.error("ColorChange.insert failed:", err);
    }
  }

  static async findAll(deviceId) {
    try {
      const res = await client.query(
        `SELECT id, device_id, color, changed_by, changed_at
         FROM color_changes
         WHERE device_id = $1
         ORDER BY changed_at DESC`,
        [deviceId],
      );
      return res.rows;
    } catch (err) {
      console.error("ColorChange.findAll failed:", err);
    }
  }
}
