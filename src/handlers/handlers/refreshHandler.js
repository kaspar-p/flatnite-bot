const { sendMessage, replaceMessageContent } = require("../../message");
const { refreshSite } = require("../../crawl");

const refreshHandler = async () => {
  const message = await sendMessage("Refreshing...");
  await refreshSite();

  await replaceMessageContent(message, "Done refreshing!");
};

module.exports = refreshHandler;
