import app from "./app";
import { toggleSettings } from "./settings";

/* Buttons handling */
const START_BTN = document.getElementById("start-btn");
const STOP_BTN = document.getElementById("stop-btn");
const OPTIONS_BTN = document.getElementById("options-btn");

START_BTN.addEventListener("click", () => {
  app.start();
});

STOP_BTN.addEventListener("click", () => {
  app.stop();
});

OPTIONS_BTN.addEventListener("click", () => {
  toggleSettings();
});

export function toggleStart() {
  START_BTN.style.display = "none";
  STOP_BTN.style.display = "block";
}

export function toggleStop() {
  START_BTN.style.display = "block";
  STOP_BTN.style.display = "none";
}
