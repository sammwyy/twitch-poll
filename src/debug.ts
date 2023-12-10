import chat from "./chat";

chat.on("connected", (server: string) => {
  console.log("[TMI] Connected:", server);
});

chat.on("join", (channel: string) => {
  console.log("[TMI] Joined:", channel);
});

chat.on("part", (channel: string) => {
  console.log("[TMI] Parted:", channel);
});
