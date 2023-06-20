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
  // const username = socket.handshake.auth.username;
  // console.log(username);
  // if (!username) {
  //   return next(new Error("invalid username"));
  // }
  // create new session
  socket.sessionID = randomId();
  socket.userID = randomId();
  // socket.username = username;
  next();
});

io.on("connection", (socket) => {
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  console.log(`CONNECT ==> ${socket.id}/${socket.sessionID}/${socket.userID}`);
  // console.log(`CONNECT ==> ${socket.id}`)

  socket.on("ping", (cb) => {
    console.log("ping");
    cb();
  });

  socket.on("disconnect", () => {
    console.log(`DISCONNECT ==> ${socket.id}`);
  });
});

httpServer.listen(3000, () => {
  console.log("server listening at http://localhost:3000");
});
