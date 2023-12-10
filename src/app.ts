import { addActivityItem, clearActivity } from "./activity";
import { DEBUG } from "./constants";
import chart, { COLORS } from "./results";
import { toggleStart, toggleStop } from "./ui";

/* App status */
type Json<K extends string | number | symbol, V> = { [key in K]: V[] };
type Votes = Json<string, string>;
type OptionData = { id: string; label: string; labelColor: string };

export interface AppSettings {
  votes: Votes;
  options: string[];
  username: string | null;
}

class App implements AppSettings {
  public active: boolean;
  public changed: boolean;
  public votes: Votes;
  public options: string[];
  public username: string | null;

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
    const data = chart.data;
    data.labels = this.options;
    chart.update();
  }

  updateValues() {
    const results = this.getResults();
    const resultsMapped = results.map((data) => data.value);

    const data = chart.data;
    data.datasets[0].data = resultsMapped;
    chart.update();
  }

  reset(options: string[] = [], votes: Votes = {}, save: boolean = true) {
    this.options = options;
    this.votes = votes;
    this.active = false;
    this.updateLabels();
    this.updateValues();
    clearActivity();

    if (save) {
      this.changed = true;
    }
  }

  start() {
    this.active = true;
    toggleStart();
  }

  stop() {
    this.active = false;
    toggleStop();
  }

  findOption(message: string): OptionData | null {
    const msgLower = message.toLowerCase();
    let i = 0;

    for (const label of this.options) {
      const labelLower = label.toLowerCase();
      if (labelLower == msgLower) {
        return {
          id: labelLower,
          label,
          labelColor: COLORS[i],
        };
      }

      i++;
    }

    return null;
  }

  hasVoted(username: string) {
    if (DEBUG) return false;

    for (const key in this.votes) {
      const list = this.votes[key];
      if (list.includes(username.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  addVote(option: OptionData, username: string, color: string) {
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

    addActivityItem({
      feed: "has voted",
      highlight: label,
      username: username,
      highlightColor: labelColor,
      usernameColor: color,
    });
  }

  parseVote(message: string, username: string, color: string) {
    message = message
      .trim()
      .replace(/[^\w ]/g, "")
      .replace(/\s+/g, "");

    const option = this.findOption(message);

    if (option) {
      this.addVote(option, username, color);
    } else {
      console.log("Failed to parse option (null)", message);
    }
  }
}

const app = new App();
export default app;
