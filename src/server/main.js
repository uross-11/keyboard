import { io } from "./server.js";
// import { DeviceLogs, Devices, ColorChanges } from "./db";
import { Devices } from "./db/devices.js";

const keyboards = new Map();

async function init() {
  const devices = await Devices.findAll();

  if (!devices || devices.length === 0) {
    console.log("No devices found in the database.");
    return;
  }

  for (const device of devices) {
    keyboards.set(device.id, {
      color: device.color,
      connected: device.connected,
    });
  }
}

await init();

function isKeyboardClient(socket) {
  return socket.handshake.headers["user-agent"] === "node-XMLHttpRequest";
}

io.use(async (socket, next) => {
  if (!isKeyboardClient(socket)) return next();

  const { sessionID, index } = socket.handshake.auth;

  if (!sessionID) {
    console.error("Missing sessionID in handshake:", socket.handshake);
    return next(new Error());
  }

  const user = await Devices.findOne(index);

  if (!user) {
    console.log("Creating new device entry for sessionID:", sessionID);

    const newDevice = await Devices.insert({ color: "green" });

    if (!newDevice) {
      console.error(
        "Failed to create new device entry for sessionID:",
        // sessionID,
      );
      return next(new Error());
    }

    console.log("New device created:", newDevice);

    socket.keyboardID = newDevice.id;
    socket.color = newDevice.color;

    keyboards.set(newDevice.id, {
      color: newDevice.color,
    });

    return next();

    // return next(new Error());
  }

  if (user.id) {
    socket.keyboardID = user.id;
    socket.color = user.color;
    return next();
  }

  next();
});

io.on("connection", async (socket) => {
  const id = socket.keyboardID;

  if (isKeyboardClient(socket)) {
    await Devices.updateConnected(id, true);
    keyboards.set(id, { ...keyboards.get(id), connected: true });
  }

  if (isKeyboardClient(socket)) {
    console.log({ ...keyboards.get(id), id });
  }

  if (!isKeyboardClient(socket)) {
    for (const [key, value] of keyboards.entries()) {
      socket.emit("status", {
        ...value,
        id: key,
      });
    }
  }

  // if (!isKeyboardClient(socket)) {
  //   interval = setInterval(() => {
  //     for (const [key, value] of keyboards.entries()) {
  //       socket.broadcast.emit("status", {
  //         ...value,
  //         id: key,
  //       });
  //     }
  //   }, 1000);
  // }

  socket.broadcast.emit("status", { ...keyboards.get(id), id });

  socket.on("color", async (payload) => {
    const targetId = Number(payload.split("-")[1]);
    const color = payload.split("-")[0];

    const updated = await Devices.updateColor(targetId, color);

    keyboards.set(targetId, {
      ...keyboards.get(targetId),
      color: updated.color,
    });

    socket.broadcast.emit("status", { ...keyboards.get(targetId), id: targetId });
    // socket.broadcast.emit("color", {
    //   id: targetId,
    //   color: updated.color,
    // });
  });

  socket.on("disconnect", async () => {
    if (isKeyboardClient(socket)) {
      await Devices.updateConnected(id, false);
      console.log("user disconnected:", id);
      keyboards.set(id, { ...keyboards.get(id), connected: false });
    }

    socket.broadcast.emit("status", { ...keyboards.get(id), id });
  });
});
