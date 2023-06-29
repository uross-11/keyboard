import "dotenv/config.js";
import express from "express";
import crypto from "crypto";
import ViteExpress from "vite-express";
import { createServer } from "http";
import { SessionStore } from "./sessionStore.js";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const sessionStore = new SessionStore();

const keyboard1 = process.env.KEYBOARD_1;
const keyboard2 = process.env.KEYBOARD_2;
const frontend = process.env.FRONTEND;

console.log(keyboard1, keyboard2, frontend);

const id = ["red-1", "green-1", "blue-1", "red-2", "green-2", "blue-2"];

// crypto deprecated
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

  console.log("user connected: ", sessionStore.findSession(socket.sessionID));

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  socket.on("color", (payload) => {
    console.log(payload);
    sessionStore.findSession(socket.sessionID).username;
  });

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
        sessionStore.findSession(socket.sessionID).username
      );
    }
  });
});

app.get("/hello", (_, res) => {
  res.send("Hello Vite!");
});

const server = httpServer.listen(3000, () => {
  sessionStore.restoreSessions();
  console.log("server listening at http://localhost:3000");
});

ViteExpress.bind(app, server);
