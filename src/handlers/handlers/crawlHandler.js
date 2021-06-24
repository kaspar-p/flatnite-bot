const { commands } = require("../../store");
const { handleUserInput } = require("../../crawl");
const { CHANNEL } = require("../../constants");
const { sendMessage, addMessageContent } = require("../../message");

const crawlHandler = async (client, msg) => {
  const rightChannel = msg.channel.id === CHANNEL;
  const rightMessage = msg.content in commands;

  if (rightChannel && rightMessage) {
    // Create a flatnite lobby and send the link
    const message = await sendMessage(client, "Get in here nerds: ");
    const link = await handleUserInput();
    await addMessageContent(message, link);
  }
};

module.exports = crawlHandler;
