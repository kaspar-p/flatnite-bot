const { sendMessage } = require("../../message");
const { CLASSES } = require("../../constants");
const { writeCombination } = require("../../victory");

const victoryHandler = async (client, msg) => {
  if (!msg.content.split(" ")[1]) {
    sendMessage(client, "The arguments to dub cannot be empty!");
    return;
  }

  const args = msg.content.split(" ");
  const classArgs = args.slice(1).map((e) => e.trim().toLowerCase());

  let validClasses = true;
  classArgs.forEach((arg) => {
    if (!CLASSES.includes(arg)) {
      sendMessage(client, `The argument '${arg}' is not a valid class.`);
      validClasses = false;
    }
  });
  if (!validClasses) return;

  if (classArgs.length < 1 || classArgs.length > 4) {
    sendMessage(client, "Too few or too many arguments!");
    return;
  }

  const error = writeCombination(classArgs);

  if (error) {
    sendMessage(client, `Combination not recorded: ${error}`);
  } else {
    sendMessage(client, `Recorded combination: ${classArgs.join(" + ")}`);
  }
};

module.exports = victoryHandler;
