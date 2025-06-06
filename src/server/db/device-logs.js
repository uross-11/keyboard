import { client } from "./client.js";

export class DeviceLogs {
  static async insert(deviceId, eventType, message = null) {
    try {
      const res = await client.query(
        `INSERT INTO device_logs (device_id, event_type, message)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [deviceId, eventType, message],
      );
      return res.rows[0];
    } catch (err) {
      console.error("DeviceLog.insert failed:", err);
    }
  }
}
