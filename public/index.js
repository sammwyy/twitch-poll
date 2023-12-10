define("activity", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.clearActivity = exports.addActivityItem = void 0;
    const activityElement = document.getElementById("activity");
    function fixActivityLength(maxLength) {
        const children = activityElement.getElementsByTagName("div");
        if (children.length > maxLength) {
            activityElement.removeChild(children[0]);
        }
    }
    function addActivityItem(activity) {
        const { username, usernameColor, feed, highlightColor, highlight } = activity;
        const item = document.createElement("div");
        item.classList.add("activity-item");
        item.innerHTML = `
    <span class="activity-user" style="color: ${usernameColor || "purple"}">${username}</span>
    <span class="activity-feed">${feed}</span>
    <span class="activity-highlight" style="color: ${highlightColor || "orange"}">${highlight}</span>
  `;
        activityElement.appendChild(item);
        fixActivityLength(20);
    }
    exports.addActivityItem = addActivityItem;
    function clearActivity() {
        activityElement.innerHTML = "";
    }
    exports.clearActivity = clearActivity;
    // Auto scroll activity.
    function scrollActivity() {
        activityElement.scrollBy(0, 1);
    }
    setInterval(scrollActivity, 5);
});
define("constants", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VERSION = exports.DEBUG = void 0;
    exports.DEBUG = false;
    exports.VERSION = 1;
});
define("results", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.COLORS = void 0;
    exports.COLORS = [
        "#FFB5E8",
        "#B28DFF",
        "#85E3FF",
        "#BFFCC6",
        "#FFABAB",
        "#6EB5FF",
    ];
    const chartData = {
        labels: [],
        datasets: [
            {
                label: "Votes",
                data: [],
                backgroundColor: exports.COLORS,
                hoverOffset: 4,
            },
        ],
    };
    const _this = globalThis;
    const chart = new _this.Chart("chart", {
        type: "pie",
        data: chartData,
    });
    exports.default = chart;
});
define("settings", ["require", "exports", "app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toggleSettings = exports.hideSettings = exports.showSettings = exports.initializeForm = void 0;
    const SETTINGS_UI = document.getElementById("settings");
    const SETTINGS_WRAPPER = document.getElementById("settings-wrapper");
    const SETTINGS_FORM = document.getElementById("settings-form");
    const formData = {};
    function getFormInputs() {
        return SETTINGS_FORM.querySelectorAll("input");
    }
    function getFormData(options = { skipNull: true, skipEmpty: true }) {
        const { skipEmpty, skipNull } = options;
        const data = {};
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
    function initializeForm(options, addListener = true) {
        let i = 0;
        getFormInputs().forEach((input) => {
            const name = input.getAttribute("name");
            input.value = options[i] || "";
            formData[name] = input.value;
            if (addListener) {
                input.addEventListener("change", (e) => {
                    const element = e.target;
                    const value = element.value;
                    if (name) {
                        formData[name] = value;
                    }
                });
            }
            i++;
        });
    }
    exports.initializeForm = initializeForm;
    SETTINGS_FORM.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = getFormData();
        const values = Object.keys(data).map((key) => data[key]);
        app_1.default.reset(values, {}, true);
        hideSettings();
    });
    /* Handle UI visibility */
    let settingsUiShowed = false;
    function showSettings() {
        settingsUiShowed = true;
        initializeForm(app_1.default.options, false);
        SETTINGS_UI.style.display = "block";
        setTimeout(() => {
            SETTINGS_UI.style.background = "#000a";
        }, 1);
        setTimeout(() => {
            SETTINGS_WRAPPER.style.top = "0px";
        }, 100);
    }
    exports.showSettings = showSettings;
    function hideSettings() {
        settingsUiShowed = false;
        SETTINGS_WRAPPER.style.top = "-1000px";
        setTimeout(() => {
            SETTINGS_UI.style.background = "#0000";
        }, 250);
        setTimeout(() => {
            SETTINGS_UI.style.display = "none";
        }, 200);
    }
    exports.hideSettings = hideSettings;
    function toggleSettings() {
        if (settingsUiShowed) {
            hideSettings();
        }
        else {
            showSettings();
        }
    }
    exports.toggleSettings = toggleSettings;
});
define("ui", ["require", "exports", "app", "settings"], function (require, exports, app_2, settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toggleStop = exports.toggleStart = void 0;
    /* Buttons handling */
    const START_BTN = document.getElementById("start-btn");
    const STOP_BTN = document.getElementById("stop-btn");
    const OPTIONS_BTN = document.getElementById("options-btn");
    START_BTN.addEventListener("click", () => {
        app_2.default.start();
    });
    STOP_BTN.addEventListener("click", () => {
        app_2.default.stop();
    });
    OPTIONS_BTN.addEventListener("click", () => {
        (0, settings_1.toggleSettings)();
    });
    function toggleStart() {
        START_BTN.style.display = "none";
        STOP_BTN.style.display = "block";
    }
    exports.toggleStart = toggleStart;
    function toggleStop() {
        START_BTN.style.display = "block";
        STOP_BTN.style.display = "none";
    }
    exports.toggleStop = toggleStop;
});
define("app", ["require", "exports", "activity", "constants", "results", "ui"], function (require, exports, activity_1, constants_1, results_1, ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class App {
        constructor() {
            this.active = false;
            this.changed = false;
            this.votes = {};
            this.options = [];
            this.username = null;
        }
        getResults() {
            const results = [];
            for (const option of this.options) {
                const id = option.toLowerCase();
                const votes = this.votes[id];
                const votesCount = votes ? votes.length : 0;
                results.push({ id, value: votesCount });
            }
            return results;
        }
        updateLabels() {
            const data = results_1.default.data;
            data.labels = this.options;
            results_1.default.update();
        }
        updateValues() {
            const results = this.getResults();
            const resultsMapped = results.map((data) => data.value);
            const data = results_1.default.data;
            data.datasets[0].data = resultsMapped;
            results_1.default.update();
        }
        reset(options = [], votes = {}, save = true) {
            this.options = options;
            this.votes = votes;
            this.active = false;
            this.updateLabels();
            this.updateValues();
            (0, activity_1.clearActivity)();
            if (save) {
                this.changed = true;
            }
        }
        start() {
            this.active = true;
            (0, ui_1.toggleStart)();
        }
        stop() {
            this.active = false;
            (0, ui_1.toggleStop)();
        }
        findOption(message) {
            const msgLower = message.toLowerCase();
            let i = 0;
            for (const label of this.options) {
                const labelLower = label.toLowerCase();
                if (labelLower == msgLower) {
                    return {
                        id: labelLower,
                        label,
                        labelColor: results_1.COLORS[i],
                    };
                }
                i++;
            }
            return null;
        }
        hasVoted(username) {
            if (constants_1.DEBUG)
                return false;
            for (const key in this.votes) {
                const list = this.votes[key];
                if (list.includes(username.toLowerCase())) {
                    return true;
                }
            }
            return false;
        }
        addVote(option, username, color) {
            if (this.hasVoted(username)) {
                console.log("Failed to add vote (Already voted)", username);
                return;
            }
            const { id, label, labelColor } = option;
            const votes = this.votes[id] || [];
            votes.push(username.toLowerCase());
            this.votes[id] = votes;
            this.updateValues();
            this.changed = true;
            (0, activity_1.addActivityItem)({
                feed: "has voted",
                highlight: label,
                username: username,
                highlightColor: labelColor,
                usernameColor: color,
            });
        }
        parseVote(message, username, color) {
            message = message
                .trim()
                .replace(/[^\w ]/g, "")
                .replace(/\s+/g, "");
            const option = this.findOption(message);
            if (option) {
                this.addVote(option, username, color);
            }
            else {
                console.log("Failed to parse option (null)", message);
            }
        }
    }
    const app = new App();
    exports.default = app;
});
define("chat", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const _this = globalThis;
    const tmi = _this.tmi;
    const chat = new tmi.Client({
        channels: [],
    });
    chat.connect();
    exports.default = chat;
});
define("login", ["require", "exports", "app", "chat"], function (require, exports, app_3, chat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.recoverSession = void 0;
    const LOADING_UI = document.getElementById("loading");
    const LOGIN_UI = document.getElementById("login");
    const LOGIN_FORM = document.getElementById("login-form");
    const LOGIN_ERROR = document.getElementById("login-error");
    const LOGIN_USERNAME = document.getElementById("username");
    const LOGOUT_BTN = document.getElementById("logout-btn");
    /* Toggle visibility */
    function showError(message) {
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
    function login(username, save = false) {
        let joinTimeout = setTimeout(() => {
            hideLoading();
            showError("No hubo respuesta de Twitch");
        }, 5000);
        showLoading();
        chat_1.default.join(username);
        chat_1.default.once("join", () => {
            hideLoading();
            hideLogin();
            clearInterval(joinTimeout);
            LOGIN_USERNAME.innerText = username;
            if (save) {
                app_3.default.username = username;
                app_3.default.changed = true;
            }
        });
    }
    function recoverSession() {
        hideError();
        showLoading();
        showLogin();
        if (app_3.default.username) {
            login(app_3.default.username);
        }
        else {
            hideLoading();
        }
    }
    exports.recoverSession = recoverSession;
    /* Handle form */
    LOGIN_FORM.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = LOGIN_FORM.querySelector("input");
        const username = input.value;
        login(username, true);
    });
    /* Handle logout */
    function logout() {
        chat_1.default.part(app_3.default.username);
        app_3.default.username = null;
        app_3.default.changed = true;
        showLogin();
    }
    LOGOUT_BTN.addEventListener("click", logout);
});
define("persistent_data", ["require", "exports", "constants"], function (require, exports, constants_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.save = exports.tryLoad = void 0;
    function clearPersistentData() {
        localStorage.clear();
    }
    function mustForget(key) {
        const rawVersion = localStorage.getItem(key + "_version");
        if (rawVersion == null || parseInt(rawVersion) != constants_2.VERSION) {
            return true;
        }
        return false;
    }
    function load(key) {
        const rawSettings = localStorage.getItem(key);
        const value = rawSettings ? JSON.parse(rawSettings) : null;
        return value ? value : null;
    }
    function tryLoad(key) {
        if (mustForget(key)) {
            clearPersistentData();
            return null;
        }
        return load(key);
    }
    exports.tryLoad = tryLoad;
    function save(key, value) {
        const rawSettings = JSON.stringify(value);
        localStorage.setItem(key, rawSettings);
        localStorage.setItem(key + "_version", constants_2.VERSION.toString());
    }
    exports.save = save;
});
define("index", ["require", "exports", "app", "chat", "constants", "login", "persistent_data", "settings", "ui"], function (require, exports, app_4, chat_2, constants_3, login_1, persistent_data_1, settings_2, ui_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function start() {
        console.log("Starting TwitchPoll");
        // Show settings if is debugging.
        if (constants_3.DEBUG) {
            (0, settings_2.showSettings)();
        }
        else {
            (0, settings_2.hideSettings)();
        }
        // Stop by default.
        (0, ui_2.toggleStop)();
        // Load saved settings.
        const settings = (0, persistent_data_1.tryLoad)("settings");
        if (settings) {
            app_4.default.options = settings.options || [];
            app_4.default.votes = settings.votes || {};
            app_4.default.username = settings.username || null;
        }
        else {
            app_4.default.changed = true;
        }
        // Save settings every 1 seconds if changed.
        setInterval(() => {
            if (app_4.default.changed) {
                app_4.default.changed = false;
                (0, persistent_data_1.save)("settings", {
                    options: app_4.default.options,
                    votes: app_4.default.votes,
                    username: app_4.default.username,
                });
            }
        }, 1000);
        // Initialize settings.
        (0, settings_2.initializeForm)(app_4.default.options, true);
        // Update chart after 100ms.
        setTimeout(() => {
            app_4.default.reset(app_4.default.options, app_4.default.votes, false);
        }, 100);
        // Show loading / login.
        chat_2.default.once("connected", () => {
            (0, login_1.recoverSession)();
        });
        // Connect twitch chat.
        chat_2.default.on("message", (_channel, tags, message) => {
            const { color, username } = tags;
            if (app_4.default.active) {
                app_4.default.parseVote(message, username, color);
            }
        });
    }
    start();
});
//# sourceMappingURL=index.js.map