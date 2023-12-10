import type { ChatUserstate } from "tmi.js";

import app, { AppSettings } from "./app";
import chat from "./chat";
import { DEBUG } from "./constants";
import { recoverSession } from "./login";
import { save, tryLoad } from "./persistent_data";
import { hideSettings, initializeForm, showSettings } from "./settings";
import { toggleStop } from "./ui";

type Nullable<T> = undefined | null | T;

function start() {
  console.log("Starting TwitchPoll");

  // Show settings if is debugging.
  if (DEBUG) {
    showSettings();
  } else {
    hideSettings();
  }

  // Stop by default.
  toggleStop();

  // Load saved settings.
  const settings = tryLoad("settings") as Nullable<AppSettings>;

  if (settings) {
    app.options = settings.options || [];
    app.votes = settings.votes || {};
    app.username = settings.username || null;
  } else {
    app.changed = true;
  }

  // Save settings every 1 seconds if changed.
  setInterval(() => {
    if (app.changed) {
      app.changed = false;

      save("settings", {
        options: app.options,
        votes: app.votes,
        username: app.username,
      });
    }
  }, 1000);

  // Initialize settings.
  initializeForm(app.options, true);

  // Update chart after 100ms.
  setTimeout(() => {
    app.reset(app.options, app.votes, false);
  }, 100);

  // Show loading / login.
  chat.once("connected", () => {
    recoverSession();
  });

  // Connect twitch chat.
  chat.on(
    "message",
    (_channel: string, tags: ChatUserstate, message: string) => {
      const { color, username } = tags;

      if (app.active) {
        app.parseVote(message, username, color);
      }
    }
  );
}

start();
