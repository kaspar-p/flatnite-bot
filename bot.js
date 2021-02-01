const Discord = require("discord.js");
const client = new Discord.Client();
const { connectToSite, getLink } = require("./crawl");
require("dotenv").config();

let ready = false;

client.on("ready", async () => {
  console.log("Successfully connected to discord server.");

  // Begin accessing surviv.io
  await connectToSite();
  ready = true;
});

client.on("message", async (msg) => {
  const rightChannel = msg.channel.id === process.env.CHANNEL_ID;
  const rightMessage = msg.content.toLowerCase() === "gaming";

  if (rightChannel && rightMessage) {
    if (ready) {
      // Create a flatnite lobby and send the link
      msg.channel.send("Get in here nerds: ");
      const link = await getLink();
      msg.channel.send(link);
    } else {
      msg.channel.send(
        "Bot is working hard with tears streaming down its face.\n" +
          "Please wait a few minutes for the bot to be ready for gaming."
      );
    }
  }
});

client.login(process.env.BOT_TOKEN);
