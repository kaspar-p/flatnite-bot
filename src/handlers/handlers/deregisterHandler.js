const { sendMessage } = require("../../message");
const { commands } = require("../../store");

const deregisterHandler = async (msg) => {
  if (!msg.content.split(" ")[1]) {
    sendMessage("The command to deregister cannot be empty!");
  }

  const command = msg.content.split(" ")[1].trim();

  if (command.startsWith(".") || command === "gaming") {
    sendMessage(`Cannot delete base command '${command}'`);
  } else if (Object.keys(commands).includes(command)) {
    commands.deleteCommand(command);
    sendMessage(`Deleted command '${command}'`);
  } else {
    sendMessage(`Cannot delete unrecognized command: '${command}'`);
  }
};

module.exports = deregisterHandler;
