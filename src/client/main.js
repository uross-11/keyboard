import "./style.css";
import keyboardBlack from "./keyboard-black.svg";
import keyboardWhite from "./keyboard-white.svg";
import { setColor, kbd1, kbd2 } from "./color";

const id = ["red-1", "green-1", "blue-1", "red-2", "green-2", "blue-2"];

document.querySelector("#app").innerHTML = `
  <main class="h-full text-white px-5 pt-7 lg:flex lg:gap-11 lg:justify-center lg:mt-40">
    <div class="${
      kbd1.connected ? "" : "opacity-30"
    } h-80 w-full border border-zinc-600 rounded-lg mb-7 relative p-5 grid lg:max-w-lg">
      <span class="absolute flex justify-center top-[-1.25rem] left-4 bg-zinc-900 text-3xl w-9">1</span>
      <div class="flex justify-end h-fit">
        <span class="relative flex justify-center items-center h-3 w-3">
          <span class="${
            kbd1.connected ? "animate-ping bg-green-500" : "bg-zinc-500"
          } absolute inline-flex h-full w-full rounded-full opacity-75"></span>
          <span class="${
            kbd1.connected ? "bg-green-500" : "bg-zinc-500"
          } relative inline-flex rounded-full h-2 w-2"></span>
        </span>
      </div>
      <div class="w-72 mx-auto h-fit relative">
        <div id="color-1"></div>
        <img src="${keyboardWhite}" class="opacity-90" alt="Keyboard 1 image">
      </div>
      <div class="flex gap-4 mx-auto self-end">
        <button id="red-1" class="text-zinc-100 bg-zinc-900 border border-zinc-600 hover:border-zinc-400 active:bg-zinc-800 mx-auto block py-2 px-5 text-md rounded-lg lg:py-1 lg:px-6">Red</button>
        <button id="green-1" class="text-zinc-100 bg-zinc-900 border border-zinc-600 hover:border-zinc-400 active:bg-zinc-800 mx-auto block py-2 px-5 text-md rounded-lg lg:py-1 lg:px-6">Green</button>
        <button id="blue-1" class="text-zinc-100 bg-zinc-900 border border-zinc-600 hover:border-zinc-400 active:bg-zinc-800 mx-auto block py-2 px-5 text-md rounded-lg lg:py-1 lg:px-6">Blue</button>
      </div>
    </div>
    <div class="${
      kbd2.connected ? "" : "opacity-30"
    } h-80 w-full border border-zinc-600 rounded-lg relative p-5 grid lg:max-w-lg">
      <span class="absolute flex justify-center top-[-1.25rem] left-4 bg-zinc-900 text-3xl w-9">2</span>
      <div class="flex justify-end h-fit">
        <span class="relative flex justify-center items-center h-3 w-3">
          <span class="${
            kbd2.connected ? "animate-ping bg-green-500" : "bg-zinc-500"
          } absolute inline-flex h-full w-full rounded-full opacity-75"></span>
          <span class="${
            kbd2.connected ? "bg-green-500" : "bg-zinc-500"
          } relative inline-flex rounded-full h-2 w-2"></span>
        </span>
      </div>
      <div class="w-72 mx-auto h-fit relative">
        <div id="color-2"></div>
        <img src="${keyboardBlack}" class="opacity-90" alt="Keyboard 2 image">
      </div>
      <div class="flex gap-4 mx-auto self-end">
        <button id="red-2" class="text-zinc-100 bg-zinc-900 border border-zinc-600 hover:border-zinc-400 active:bg-zinc-800 mx-auto block py-2 px-5 text-md rounded-lg lg:py-1 lg:px-6">Red</button>
        <button id="green-2" class="text-zinc-100 bg-zinc-900 border border-zinc-600 hover:border-zinc-400 active:bg-zinc-800 mx-auto block py-2 px-5 text-md rounded-lg lg:py-1 lg:px-6">Green</button>
        <button id="blue-2" class="text-zinc-100 bg-zinc-900 border border-zinc-600 hover:border-zinc-400 active:bg-zinc-800 mx-auto block py-2 px-5 text-md rounded-lg lg:py-1 lg:px-6">Blue</button>
      </div>
    </div>
  </main>
`;

for (let i = 0; i < id.length; i++) {
  const item = id[i];
  setColor(item);
}

document.getElementById(
  "color-1"
).className = `${kbd1.color} inset-[-7px] absolute -z-10 blur-sm`;
document.getElementById(
  "color-2"
).className = `${kbd2.color} inset-[-7px] absolute -z-10 blur-sm`;
