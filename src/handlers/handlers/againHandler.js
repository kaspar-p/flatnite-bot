const { sendMessage } = require("../../message");
const { CLASSES_LIMIT } = require("../../constants");
const { createCombination } = require("../../victory");

const againHandler = async (msg) => {
  const playerNumArg = msg.content.split(" ")[1];

  if (!playerNumArg || isNaN(parseInt(playerNumArg))) {
    sendMessage(`Number of players input '${playerNumArg}' is not valid.`);
    return;
  }

  const num = parseInt(playerNumArg);
  if (!num || num < 1 || num > CLASSES_LIMIT) {
    sendMessage(`Number of players invalid! Must satisfy: 1 <= n <= 4!`);
    return;
  }

  // Send the user a new combination to try
  const [newCombination, message] = createCombination(num);

  sendMessage(message);

  let assignment = "Try this:\n";
  for (let i = 0; i < num; i++) {
    const chosenClass = newCombination[i].toUpperCase();
    assignment += ` -> [6krill] player${i + 1}: ${chosenClass}\n`;
  }

  sendMessage(assignment);
};

module.exports = againHandler;
