import app from "./app";

const SETTINGS_UI = document.getElementById("settings");
const SETTINGS_WRAPPER = document.getElementById("settings-wrapper");
const SETTINGS_FORM = document.getElementById("settings-form");

/* Handle settings form */
type JsonElement = boolean | number | string | null | Array<Json>;
type Json = { [key: string]: JsonElement | undefined };

const formData: Json = {};

function getFormInputs() {
  return SETTINGS_FORM.querySelectorAll("input");
}

function getFormData(options = { skipNull: true, skipEmpty: true }) {
  const { skipEmpty, skipNull } = options;
  const data: Json = {};

  for (const key in formData) {
    const value = formData[key];

    if (skipNull && value == null) {
      continue;
    }

    if (skipEmpty && value == "") {
      continue;
    }

    data[key] = value;
  }

  return data;
}

export function initializeForm(options: string[], addListener = true) {
  let i = 0;

  getFormInputs().forEach((input) => {
    const name = input.getAttribute("name");
    input.value = options[i] || "";
    formData[name] = input.value;

    if (addListener) {
      input.addEventListener("change", (e) => {
        const element = e.target as HTMLInputElement;
        const value = element.value;

        if (name) {
          formData[name] = value;
        }
      });
    }

    i++;
  });
}

SETTINGS_FORM.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = getFormData();
  const values = Object.keys(data).map((key) => data[key]);
  app.reset(values as string[], {}, true);
  hideSettings();
});

/* Handle UI visibility */
let settingsUiShowed = false;

export function showSettings() {
  settingsUiShowed = true;
  initializeForm(app.options, false);

  SETTINGS_UI.style.display = "block";

  setTimeout(() => {
    SETTINGS_UI.style.background = "#000a";
  }, 1);

  setTimeout(() => {
    SETTINGS_WRAPPER.style.top = "0px";
  }, 100);
}

export function hideSettings() {
  settingsUiShowed = false;
  SETTINGS_WRAPPER.style.top = "-1000px";

  setTimeout(() => {
    SETTINGS_UI.style.background = "#0000";
  }, 250);

  setTimeout(() => {
    SETTINGS_UI.style.display = "none";
  }, 200);
}

export function toggleSettings() {
  if (settingsUiShowed) {
    hideSettings();
  } else {
    showSettings();
  }
}
