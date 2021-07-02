require("dotenv").config();
const Discord = require("discord.js");
const scheduler = require("node-schedule");

const discordClient = new Discord.Client();
const { connectToSite, refreshSite } = require("./crawl");
const handleMessage = require("./handlers/messageHandler");
const { availability, client } = require("./store");
const { MODE } = require("./constants");
const { sendMode } = require("./message");

discordClient.on("ready", async () => {
  console.log("Successfully connected to discord server.");
  client.setClient(client);

  if (MODE.PRODUCTION || MODE.DEVELOP_WEB) {
    // Begin accessing surviv.io
    await connectToSite();
  }

  availability.setReady(true);
});

discordClient.on("message", async (msg) => {
  await handleMessage(msg);
});

discordClient.login(process.env.BOT_TOKEN);

// 4pm
const timeToSendMode = 16;

// Every day at noon
scheduler.scheduleJob(`00 ${timeToSendMode} * * *`, async () => {
  if (availability.ready) {
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
