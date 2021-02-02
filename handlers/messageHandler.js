const { commands } = require("../constants/commands");
const handlers = require("./handlers");

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
    await handlers[matchedCommand](client, msg);
  }
};

module.exports = handleMessage;
