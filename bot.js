const Discord = require("discord.js");
const client = new Discord.Client();
const { connectToSite, getLink, beginChromeDriver } = require("./crawl");
require("dotenv").config();

let busy = false;

client.on("ready", async () => {
  console.log("Successfully connected!");

  // Begin accessing surviv.io
  await connectToSite();
});

client.on("message", async (msg) => {
  const requirements = [
    msg.channel.id === process.env.CHANNEL_ID,
    msg.content.toLowerCase() === "gaming",
    busy === false,
  ];

  const meetsRequirements = requirements.reduce(
    (result, current) => result && current,
    true
  );

  if (meetsRequirements) {
    busy = true;
    // Create a flatnite lobby and send the link
    msg.channel.send("Get in here nerds: ");
    const link = await getLink(msg.channel.send);
    msg.channel.send(link.toString());
    busy = false;
  }
});

client.login(process.env.BOT_TOKEN);
