import type { Client } from "tmi.js";

type TMI = {
  Client: Client;
};

/* Twitch connection */
type withTMI<A> = A & {
  tmi: TMI;
};

const _this = globalThis as withTMI<typeof globalThis>;
const tmi = _this.tmi;

const chat = new tmi.Client({
  channels: [],
});

chat.connect();

export default chat;
