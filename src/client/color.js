import { io } from "socket.io-client";

const socket = io();

socket.on("connect", () => {
  console.log("connected");
});

export function setColor(element) {
  element.addEventListener("click", () => socket.emit("red"));
}
