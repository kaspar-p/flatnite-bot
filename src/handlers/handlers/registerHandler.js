const { sendMessage } = require("../../message");
const { REQUIREMENTS } = require("../../constants");
const { commands } = require("../../store");

const checkValidation = (newRegister) => {
  // Returns the validation status of the new register

  const errorMessages = [];

  REQUIREMENTS.forEach((violationSet) => {
    const test = violationSet(newRegister);
    const passes = test.requirement.reduce(
      (pass, current) => pass && current,
      true
    );

    if (!passes) {
      errorMessages.push(test.violation);
    }
  });

  if (this.length >= 50) {
    errorMessages.push("There cannot be more than 50 commands!");
  }

  return { isValid: errorMessages.length === 0, errorMessages };
};

const registerHandler = async ({ content }) => {
  if (!content.split(" ")[1]) {
    sendMessage("New command cannot be empty!");
    return;
  }

  // Register a new word to trigger the bot
  const newRegister = content
    .split(" ")
    .slice(1)
    .map((e) => e.trim())
    .join(" ")
    .trim();

  const validationReport = checkValidation(newRegister);

  if (!validationReport.isValid) {
    sendMessage(
      `${
        validationReport.errorMessages.length
      } errors returned: \n${validationReport.errorMessages
        .map((errorText) => `-> ${errorText}`)
        .join("\n")}`
    );
    return;
  }

  commands.addCommand(newRegister);
  sendMessage(`Command: '${newRegister}' registered for a gamers' use.`);
};

module.exports = registerHandler;
