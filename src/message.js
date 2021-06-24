const { CHANNEL } = require("./constants/constants");
const { getOtherMode } = require("./crawl");

const sendMessage = async (client, text) => {
  const channel = client.channels.cache.get(CHANNEL);
  const message = await channel.send(text);
  return message;
};

const sendMode = async (client) => {
  const msg = await sendMessage(client, "The mode today is: ");
  const otherMode = await getOtherMode();
  await addMessageContent(msg, otherMode);
};

const addMessageContent = async (message, newContent) => {
  const content = message.content;
  await message.edit(content + " " + newContent);
};

module.exports = {
  sendMessage,
  sendMode,
  addMessageContent,
};
