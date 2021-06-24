const { sendMessage, replaceMessageContent } = require("../../message");
const { refreshSite } = require("../../crawl");

const refreshHandler = async (client) => {
  const message = await sendMessage(client, "Refreshing...");
  await refreshSite();

  await replaceMessageContent(message, "Done refreshing!");
};

module.exports = refreshHandler;
