import { io } from "./server.js";
import { findUser, updateUserStatus, updateUserColor } from "./queries.js";

export const keyboards = new Map([
  [
    "1",
    {
      color: "blue",
      connected: false,
    },
  ],
  [
    "2",
    {
      color: "red",
      connected: false,
    },
  ],
  [
    "3",
    {
      color: "vite",
      connected: false,
    },
  ],
]);

io.use(async (socket, next) => {
  // if (socket.handshake.headers.host === "localhost:3000") return next();

  const { sessionID } = socket.handshake.auth;
  if (!sessionID) return next(new Error("Missing sessionID."));

  const user = await findUser(sessionID, next);
  if (!user || !user.id || !user.color)
    return next(new Error("Keyboard not found."));
  if (user.id) {
    socket.keyboardID = user.id;
    socket.color = user.color;
    return next();
  }

  next();
});

io.on("connection", async (socket) => {
  const id = socket.keyboardID;
  const allSockets = await io.fetchSockets();

  const { connected } = await updateUserStatus(id, true);

  if (connected === true) {
    socket.join(id);
    console.log("user connected:", id);

    keyboards.set(id, { color: socket.color, connected: true });

    for (const s of allSockets) {
      for (const key of keyboards.keys()) {
        s.emit("status", { ...keyboards.get(key), id: key });
      }
    }
  }

  socket.on("color", async (payload) => {
    const targetId = payload.split("-")[1];
    const color = payload.split("-")[0];

    const { color: updatedColor } = await updateUserColor(targetId, color);

    if (updatedColor) {
      io.to(targetId).emit("color", updatedColor);
      keyboards.set(targetId, {
        ...keyboards.get(targetId),
        color: updatedColor,
      });
    }
  });

  socket.on("disconnect", async () => {
    const { connected } = await updateUserStatus(id, false);

    if (connected === false) {
      socket.leave(id);
      console.log("user disconnected:", id);

      keyboards.set(id, { ...keyboards.get(id), connected: false });

      for (const s of allSockets) {
        for (const key of keyboards.keys()) {
          s.emit("status", { ...keyboards.get(key), id: key });
        }
      }
    }
  });
});
