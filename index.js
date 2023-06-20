import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { SessionStore } from "./sessionStore.js";
import crypto from "crypto";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const sessionStore = new SessionStore();

const randomId = () => crypto.randomBytes(8).toString("hex");

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  console.log(username);
  if (!username) {
    return next(new Error("invalid username"));
  }
  // create new session
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  console.log(`CONNECT ==> ${socket.id}`);
  // console.log(`CONNECT ==> ${socket.id}`)
  console.log(sessionStore.findAllSessions());

  socket.on("tick", (cb) => {
    socket.emit("red");
    cb();
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      });
      console.log(
        "user disconnected: ",
        sessionStore.findSession(socket.sessionID)
      );
    }
  });
});

httpServer.listen(3000, () => {
  console.log("server listening at http://localhost:3000");
});
