const express = require("express");
const ViteExpress = require("vite-express");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);

  socket.on("red", () => {
    console.log("red");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id);
  });
});

app.get("/hello", (_, res) => {
  res.send("Hello Vite!");
});

const server =  httpServer.listen(3000, () => {
  console.log("server listening at http://localhost:3000");
});

ViteExpress.bind(app, server);

