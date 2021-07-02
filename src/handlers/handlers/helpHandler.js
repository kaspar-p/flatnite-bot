const { commands } = require("../../store");
const { sendMessage } = require("../../message");

const helpHandler = async (msg) => {
  const string = msg.content;
  const argument = string.split(" ").length > 1 ? string.split(" ")[1] : null;

  if (argument) {
    if (Object.keys(commands).includes(argument)) {
      sendMessage(`Command: '${argument}' -> ${commands[argument].helpText}`);
    } else {
      sendMessage(
        "Unknown command! Try '.help' with no arguments to learn all recognized commands!"
      );
    }
  } else {
    const helpTexts = commands.getFormattedHelpTexts();

    sendMessage(`Available commands:\n${helpTexts}`);
  }
};

module.exports = helpHandler;
