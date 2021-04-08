const available = require("../balancer");
const { commands } = require("../constants/commands");
const { handlerMap } = require("./handlers");
const { sendMessage } = require("../message");

const handleMessage = async (client, msg) => {
  let matchedCommand;

  Object.keys(commands).forEach((command) => {
    if (msg.content.startsWith(command)) {
      matchedCommand = command;
      return false;
    }
  });

  if (matchedCommand) {
    if (!matchedCommand.startsWith(".")) matchedCommand = ".recognized-command";
    if (available.ready) {
      available.changeReadyStatus(false);
      await handlerMap[matchedCommand](client, msg);
      available.changeReadyStatus(true);
    } else {
      sendMessage(
        client,
        "Bot is working hard with tears streaming down its face.\n" +
          "Please wait a few minutes for the bot to be ready for gaming."
      );
    }
  }
};

module.exports = handleMessage;
