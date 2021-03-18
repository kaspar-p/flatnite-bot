require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const { connectToSite } = require("./crawl");
const handleMessages = require("./handlers/messageHandler");
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
