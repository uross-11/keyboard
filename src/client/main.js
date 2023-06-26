import "./style.css";
import { setColor } from "./color.js";

document.querySelector("#app").innerHTML = `
  <div class="card">
    <button id="red" type="button">Red</button>
  </div>
`;

setColor(document.querySelector("#red"));
