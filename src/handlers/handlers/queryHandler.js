const { CLASSES, CLASSES_LIMIT } = require("../../constants");
const { sendMessage } = require("../../message");
const {
  getExistingCombinations,
  combinationToInvariant,
} = require("../../victory");

const queryHandler = async (client, msg) => {
  // This is a little susceptible to empty strings
  const num = msg.content.split(" ").length - 1;
  if (num < 1 || num > CLASSES_LIMIT) {
    sendMessage(client, `Number of players invalid!`);
    return;
  }

  const combination = msg.content.split(" ").slice(1);

  for (const c of combination) {
    if (!CLASSES.includes(c)) {
      sendMessage(client, `Class '${c}' is not valid.`);
      return;
    }
  }

  // Send the user a new combination to try
  const [alreadyCompleted] = getExistingCombinations(num);
  const invariant = combinationToInvariant(combination);

  if (alreadyCompleted.has(invariant)) {
    sendMessage(client, `You have won with this combination before.`);
  } else {
    sendMessage(client, `You have NOT won with this combination before.`);
  }
};

module.exports = queryHandler;
