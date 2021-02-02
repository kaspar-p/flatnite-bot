require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const { connectToSite } = require("./crawl");
const handleMessages = require("./messageHandler");
const available = require("./balancer");

client.on("ready", async () => {
  console.log("Successfully connected to discord server.");

  // Begin accessing surviv.io
  await connectToSite();
  console.log("here");
  available.changeReadyStatus(true);
});

client.on("message", async (msg) => {
  await handleMessages(client, msg);
});

client.login(process.env.BOT_TOKEN);
