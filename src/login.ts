import app from "./app";
import chat from "./chat";

const LOADING_UI = document.getElementById("loading");
const LOGIN_UI = document.getElementById("login");
const LOGIN_FORM = document.getElementById("login-form");
const LOGIN_ERROR = document.getElementById("login-error");
const LOGIN_USERNAME = document.getElementById("username");
const LOGOUT_BTN = document.getElementById("logout-btn");

/* Toggle visibility */
function showError(message: string) {
  LOGIN_ERROR.style.display = "block";
  LOGIN_ERROR.innerHTML = `<span class="critical-tag">Error:</span> ${message}`;
}

function hideError() {
  LOGIN_ERROR.style.display = "none";
}

function showLoading() {
  LOADING_UI.style.display = "flex";
}

function hideLoading() {
  LOADING_UI.style.display = "none";
}

function showLogin() {
  LOGIN_UI.style.display = "flex";
}

function hideLogin() {
  LOGIN_UI.style.display = "none";
}

/* Handle login */
function login(username: string, save = false) {
  let joinTimeout = setTimeout(() => {
    hideLoading();
    showError("No hubo respuesta de Twitch");
  }, 5000);

  showLoading();

  chat.join(username);

  chat.once("join", () => {
    hideLoading();
    hideLogin();
    clearInterval(joinTimeout);
    LOGIN_USERNAME.innerText = username;

    if (save) {
      app.username = username;
      app.changed = true;
    }
  });
}

export function recoverSession() {
  hideError();
  showLoading();
  showLogin();

  if (app.username) {
    login(app.username);
  } else {
    hideLoading();
  }
}

/* Handle form */
LOGIN_FORM.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = LOGIN_FORM.querySelector("input");
  const username = input.value;
  login(username, true);
});

/* Handle logout */
function logout() {
  chat.part(app.username);
  app.username = null;
  app.changed = true;
  showLogin();
}

LOGOUT_BTN.addEventListener("click", logout);
