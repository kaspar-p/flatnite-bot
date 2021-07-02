const { CLASSES, CLASSES_LIMIT } = require("../../constants");
const { sendMessage } = require("../../message");
const {
  getExistingCombinations,
  combinationToInvariant,
} = require("../../victory");

const queryHandler = async (msg) => {
  // This is a little susceptible to empty strings
  const num = msg.content.split(" ").length - 1;
  if (num < 1 || num > CLASSES_LIMIT) {
    sendMessage(`Number of players invalid!`);
    return;
  }

  const combination = msg.content.split(" ").slice(1);

  for (const c of combination) {
    if (!CLASSES.includes(c)) {
      sendMessage(`Class '${c}' is not valid.`);
      return;
    }
  }

  // Send the user a new combination to try
  const [alreadyCompleted] = getExistingCombinations(num);
  const invariant = combinationToInvariant(combination);

  if (alreadyCompleted.has(invariant)) {
    sendMessage(`You have won with this combination before.`);
  } else {
    sendMessage(`You have NOT won with this combination before.`);
  }
};

module.exports = queryHandler;
