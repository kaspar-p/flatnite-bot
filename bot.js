require("dotenv").config();
const Discord = require("discord.js");
const scheduler = require("node-schedule");

const client = new Discord.Client();
const { connectToSite, refreshSite } = require("./crawl");
const handleMessages = require("./handlers/messageHandler");
const available = require("./balancer");
const { MODE } = require("./constants/constants");
const sendMode = require("./senders/sendMode");

client.on("ready", async () => {
  console.log("Successfully connected to discord server.");

  if (MODE.PRODUCTION) {
    // Begin accessing surviv.io
    await connectToSite();
    available.changeReadyStatus(true);
  }
});

client.on("message", async (msg) => {
  await handleMessages(client, msg);
});

client.login(process.env.BOT_TOKEN);

// Every day at noon
scheduler.scheduleJob("00 14 * * *", async () => {
  if (available.ready) {
    await refreshSite();
    await sendMode(client);
  } else {
    // If the bot is busy, wait 30 seconds and send again
    // There is almost no chance that the bot is STILL busy
    setTimeout(() => sendMode(client), 30 * 1000);
  }
});
