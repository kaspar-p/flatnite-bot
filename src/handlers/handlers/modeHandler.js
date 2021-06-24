const { sendMode } = require("../../message");

const modeHandler = async (client) => {
  await sendMode(client);
};

module.exports = modeHandler;
