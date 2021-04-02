require("dotenv").config();
const Discord = require("discord.js");
const scheduler = require("node-schedule");

const client = new Discord.Client();
const { connectToSite, getOtherMode } = require("./crawl");
const handleMessages = require("./handlers/messageHandler");
const sendMessage = require("./sendMessage");
const available = require("./balancer");
const { MODE, PRODUCTION } = require("./constants/constants");

client.on("ready", async () => {
  console.log("Successfully connected to discord server.");

  if (MODE === PRODUCTION) {
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
scheduler.scheduleJob("00 12 * * *", async () => {
  if (available.ready) {
    const otherMode = await getOtherMode();
    sendMessage(client, `The mode today is: ${otherMode}`);
  }
});
