require("dotenv").config();
const Discord = require("discord.js");
const scheduler = require("node-schedule");

const client = new Discord.Client();
const { connectToSite, refreshSite } = require("./crawl");
const handleMessages = require("./handlers/messageHandler");
const store = require("./store");
const { MODE } = require("./constants");
const { sendMode } = require("./message");

client.on("ready", async () => {
  console.log("Successfully connected to discord server.");

  if (MODE.PRODUCTION || MODE.DEVELOP_WEB) {
    // Begin accessing surviv.io
    await connectToSite();
  }
  store.availability.setReady(true);
});

client.on("message", async (msg) => {
  await handleMessages(client, msg);
});

client.login(process.env.BOT_TOKEN);

// Every day at noon
scheduler.scheduleJob("00 16 * * *", async () => {
  if (store.availability.ready) {
    await refreshSite();
    await sendMode(client);
  } else {
    // If the bot is busy, wait 30 seconds and send again
    // There is almost no chance that the bot is STILL busy
    setTimeout(() => sendMode(client), 30 * 1000);
  }
});

// Each hour except noon
scheduler.scheduleJob("00 0-11,13-23 * * *", async () => {
  await refreshSite();
});
