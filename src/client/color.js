import { io } from "socket.io-client";

const socket = io({ auth: { sessionID: import.meta.env.VITE_ID } });

socket.on("connect", () => {
  // console.log("connected");
});

socket.on("private", function (msg) {
  console.log(msg);
});

const colors = new Map([
  ["red", "bg-red-600"],
  ["green", "bg-green-600"],
  ["blue", "bg-blue-800"],
]);

export const kbd1 = { color: colors.get("blue"), connected: true };
export const kbd2 = { color: colors.get("red"), connected: true };

export function setColor(id) {
  const button = document.getElementById(id);
  button.addEventListener("click", () => {
    socket.emit("color", id);
    const index = id.split("-")[1];
    const color = id.split("-")[0];

    if (index === "1") {
      kbd1.color = colors.get(color);
      document.getElementById("color-1").className = `${colors.get(
        color
      )} inset-[-7px] absolute -z-10 blur-sm`;
      console.log(kbd1);
    }

    if (index === "2") {
      kbd2.color = colors.get(color);
      document.getElementById("color-2").className = `${colors.get(
        color
      )} inset-[-7px] absolute -z-10 blur-sm`;
      console.log(kbd2);
    }
  });
}
