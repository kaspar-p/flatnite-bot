const sendMessage = require("./sendMessage");
const { getOtherMode } = require("../crawl");

const sendMode = async (client) => {
  const otherMode = await getOtherMode();
  sendMessage(client, "The mode today is: " + otherMode);
};

module.exports = sendMode;
