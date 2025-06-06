import "./style.css";
import { io } from "socket.io-client";

const ids = ["red-1", "green-1", "blue-1", "red-2", "green-2", "blue-2"];

const colors = new Map([
  ["red", "bg-red-600"],
  ["green", "bg-green-600"],
  ["blue", "bg-blue-800"],
]);

export const socket = io();

socket.on("connect", () => {
  console.log("connected", socket.id);
});

socket.on("disconnect", () => {
  console.log("disconnected");
});

socket.on("connect_error", (err) => {
  console.error(err.message);
});

socket.on("status", (status) => {
  console.log("status", status);
  if (!status) return;

  const id = status.id;
  const connected = status.connected;


  if (connected) {
    const buttons = ids
      .filter((i) => Number(i.split("-")[1]) === id)
      .map((i) => document.getElementById(i));
    buttons.forEach((button) => {
      button.disabled = false;
    });
  }

  document
    .getElementById(`card-${id}`)
    .classList.toggle("opacity-30", !connected);

  if (connected) {
    document.getElementById(`color-${id}`).className = `${colors.get(
      status.color,
    )} inset-[-7px] absolute -z-10 blur-sm transition duration-300`;
  } else {
    document.getElementById(`color-${id}`).className =
      "inset-[-7px] absolute -z-10 blur-sm transition duration-300";
  }

  const pingOuterClasses =
    " absolute inline-flex h-full w-full rounded-full opacity-75";
  document.getElementById(`pingOuter-${status.id}`).classList = status.connected
    ? "animate-ping bg-green-500" + pingOuterClasses
    : "bg-zinc-500" + pingOuterClasses;

  const pingInnerClasses = " relative inline-flex rounded-full h-2 w-2";

  document.getElementById(`pingInner-${status.id}`).classList = status.connected
    ? "bg-green-500" + pingInnerClasses
    : "bg-zinc-500" + pingInnerClasses;
});

function updateColor(id) {
  const button = document.getElementById(id);

  button.addEventListener("click", () => {
    const index = id.split("-")[1];
    const color = id.split("-")[0];

    document.getElementById(`color-${index}`).className = `${colors.get(
      color,
    )} inset-[-7px] absolute -z-10 blur-sm transition duration-[4000ms]`;

    socket.emit("color", id);
    // console.log("color", id);
  });
}

for (let i = 0; i < ids.length; i++) {
  updateColor(ids[i]);
}
