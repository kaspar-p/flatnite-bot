const { sendMessage } = require("../../message");
const { CLASSES } = require("../../constants");
const { writeCombination } = require("../../victory");

const victoryHandler = async (msg) => {
  if (!msg.content.split(" ")[1]) {
    sendMessage("The arguments to dub cannot be empty!");
    return;
  }

  const args = msg.content.split(" ");
  const classArgs = args.slice(1).map((e) => e.trim().toLowerCase());

  let validClasses = true;
  classArgs.forEach((arg) => {
    if (!CLASSES.includes(arg)) {
      sendMessage(`The argument '${arg}' is not a valid class.`);
      validClasses = false;
    }
  });
  if (!validClasses) return;

  if (classArgs.length < 1 || classArgs.length > 4) {
    sendMessage("Too few or too many arguments!");
    return;
  }

  const error = writeCombination(classArgs);

  if (error) {
    sendMessage(`Combination not recorded: ${error}`);
  } else {
    sendMessage(`Recorded combination: ${classArgs.join(" + ")}`);
  }
};

module.exports = victoryHandler;
