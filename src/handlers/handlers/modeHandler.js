const { sendMode } = require("../../message");

const modeHandler = async () => {
  await sendMode();
};

module.exports = modeHandler;
