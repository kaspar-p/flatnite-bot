const { sendMessage } = require("../../message");
const { commands } = require("../../store");

const deregisterHandler = async (client, msg) => {
  if (!msg.content.split(" ")[1]) {
    sendMessage(client, "The command to deregister cannot be empty!");
  }

  const command = msg.content.split(" ")[1].trim();

  if (command.startsWith(".") || command === "gaming") {
    sendMessage(client, `Cannot delete base command '${command}'`);
  } else if (Object.keys(commands).includes(command)) {
    commands.deleteCommand(command);
    sendMessage(client, `Deleted command '${command}'`);
  } else {
    sendMessage(client, `Cannot delete unrecognized command: '${command}'`);
  }
};

module.exports = deregisterHandler;
