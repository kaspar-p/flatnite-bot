const { handleUserInput } = require("../crawl");
const { commands, acceptedMessages } = require("../register/registerLib");
const available = require("../balancer");
const { CHANNEL } = require("../constants");
const {
  writeRegister,
  deleteRegister,
  checkValidation,
} = require("../register/register");

const sendMessage = (client, text) => {
  const channel = client.channels.cache.get(CHANNEL);
  channel.send(text);
};

const crawlRequestHandler = async (client, msg) => {
  const rightChannel = msg.channel.id === CHANNEL;
  const rightMessage = acceptedMessages.includes(msg.content);

  if (rightChannel && rightMessage) {
    if (available.ready) {
      available.changeReadyStatus(false);

      // Create a flatnite lobby and send the link
      sendMessage(client, "Get in here nerds: ");
      const link = await handleUserInput();
      sendMessage(client, link);

      available.changeReadyStatus(true);
    } else {
      sendMessage(
        client,
        "Bot is working hard with tears streaming down its face.\n" +
          "Please wait a few minutes for the bot to be ready for gaming."
      );
    }
  }
};

const helpHandler = async (client, msg) => {
  console.log("Help handler entered.");
  let string = msg.content;
  const argument = string.split(" ").length > 1 ? string.split(" ")[1] : null;

  console.log("Argument given: ", argument);

  if (argument) {
    if (Object.keys(commands).includes(argument)) {
      sendMessage(
        client,
        `Command: '${argument}' -> ${commands[argument].helpText}`
      );
    } else {
      sendMessage(
        client,
        "Unknown command! Try '.help' with no arguments to learn all recognized commands!"
      );
    }
  } else {
    sendMessage(
      client,
      `Available commands:\n-> .register <newcommand>\n-> .help\n-> .help <command>\n${acceptedMessages
        .map((aMsg) => `-> ${aMsg}`)
        .join("\n")}`
    );
  }
};

const registerHandler = async (client, { content }) => {
  if (!content.split(" ")[1]) {
    sendMessage(client, "New command cannot be empty!");
    return;
  }

  // Register a new word to trigger the bot
  const newRegister = content
    .split(" ")
    .slice(1)
    .map((e) => e.trim())
    .join(" ");

  console.log("New register: ", newRegister);

  const validationReport = checkValidation(newRegister);
  if (validationReport.isValid) {
    writeRegister(newRegister);
    sendMessage(
      client,
      `Command: '${newRegister}' registered for a gamers' use.`
    );
  } else {
    sendMessage(
      client,
      `${
        validationReport.errorMessages.length
      } errors returned: \n${validationReport.errorMessages
        .map((errorText) => `-> ${errorText}`)
        .join("\n")}`
    );
  }
};

const deregisterHandler = async (client, msg) => {
  if (!msg.content.split(" ")[1]) {
    sendMessage(client, "The command to deregister cannot be empty!");
  }

  const command = msg.content.split(" ")[1].trim();

  if (acceptedMessages.includes(command)) {
    deleteRegister(command);
    sendMessage(client, `Deleted command '${command}'`);
  }
};

module.exports = {
  helpHandler,
  registerHandler,
  crawlRequestHandler,
  deregisterHandler,
};
