require("dotenv").config();
const Discord = require("discord.js");
const scheduler = require("node-schedule");

const client = new Discord.Client();
const { connectToSite, refreshSite } = require("./crawl");
const handleMessage = require("./handlers/messageHandler");
const store = require("./store");
const { MODE } = require("./constants");
const { sendMode } = require("./message");

client.on("ready", async () => {
  console.log("Successfully connected to discord server.");
  store.clientStore.setClient(client);

  if (MODE.PRODUCTION || MODE.DEVELOP_WEB) {
    // Begin accessing surviv.io
    await connectToSite();
  }

  console.log(
    "about to set ready. client exists? ",
    !!store.clientStore.client
  );
  store.availability.setReady(true, client);
});

client.on("message", async (msg) => {
  await handleMessage(msg);
});

client.login(process.env.BOT_TOKEN);

// 4pm
const timeToSendMode = 16;

// Every day at noon
scheduler.scheduleJob(`00 ${timeToSendMode} * * *`, async () => {
  if (store.availability.ready) {
    await refreshSite();
    await sendMode();
  } else {
    // If the bot is busy, wait 30 seconds and send again
    // There is almost no chance that the bot is STILL busy
    setTimeout(() => sendMode(), 30 * 1000);
  }
});

// Each hour except noon
scheduler.scheduleJob(
  `00 0-${timeToSendMode - 1},${timeToSendMode + 1}-23 * * *`,
  async () => {
    await refreshSite();
  }
);
