const { CHANNEL } = require("../constants/constants");

const sendMessage = (client, text) => {
  const channel = client.channels.cache.get(CHANNEL);
  channel.send(text);
};

module.exports = sendMessage;
