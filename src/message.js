const { CHANNEL } = require("./constants");
const { getOtherMode } = require("./crawl");
const { clientStore } = require("./store");

const sendMessage = async (text) => {
  const channel = clientStore.client.channels.cache.get(CHANNEL);
  const message = await channel.send(text);
  return message;
};

const sendMode = async () => {
  const msg = await sendMessage("The mode today is: ");
  const otherMode = await getOtherMode();
  await addMessageContent(msg, otherMode);
};

const addMessageContent = async (message, newContent) => {
  const content = message.content;
  await message.edit(content + " " + newContent);
};

const replaceMessageContent = async (message, newContent) => {
  return await message.edit(newContent);
};

module.exports = {
  sendMessage,
  sendMode,
  addMessageContent,
  replaceMessageContent,
};
