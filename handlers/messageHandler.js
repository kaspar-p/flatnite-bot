const { commands } = require("../constants/commands");
const { handlerMap } = require("./handlers");

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
    await handlerMap[matchedCommand](client, msg);
  }
};

module.exports = handleMessage;
