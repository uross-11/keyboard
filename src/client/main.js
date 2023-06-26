import "./style.css";
import { setColor } from "./color.js";

document.querySelector("#app").innerHTML = `
  <main>
    <div class="card">
      <button id="red" type="button">Red</button>
    </div>
  </main>
`;

setColor(document.querySelector("#red"));
