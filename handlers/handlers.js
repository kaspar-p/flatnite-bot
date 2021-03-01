const _ = require("lodash");
const { commands } = require("../constants/commands");
const { handleUserInput } = require("../crawl");
const available = require("../balancer");
const { CHANNEL, CLASSES } = require("../constants/constants");
const {
  writeRegister,
  deleteRegister,
  checkValidation,
} = require("../register/register");
const { writeCombination, createCombination } = require("../victory/lib");

const sendMessage = (client, text) => {
  const channel = client.channels.cache.get(CHANNEL);
  channel.send(text);
};

const crawlRequestHandler = async (client, msg) => {
  const rightChannel = msg.channel.id === CHANNEL;
  const rightMessage = msg.content in commands;

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
  const string = msg.content;
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
    console.log(commands);

    const allHelpSnippets = [];
    _.forEach(commands, (commandObject) => {
      allHelpSnippets.push(...commandObject.helpSnippets);
    });

    const formatted = allHelpSnippets.map((e) => `-> ${e}`).join("\n");

    sendMessage(client, `Available commands:\n${formatted}`);
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

const againHandler = async (client, msg) => {
  const playerNumArg = !msg.content.split(" ")[1];

  if (!playerNumArg || isNaN(playerNumArg)) {
    sendMessage(
      client,
      `Number of players input '${playerNumArg}' is not valid.`
    );
    return;
  } else if (playerNumArg !== 2 || playerNumArg !== 3) {
    sendMessage(client, `Number of players must be either 2 or 3!`);
    return;
  }

  // Send the user a new combination to try
  const [newCombination, message] = createCombination(playerNumArg);

  sendMessage(client, message);
  sendMessage(client, `Try this: ${newCombination.join(" + ")}`);
};

const victoryHandler = async (client, msg) => {
  if (!msg.content.split(" ")[1]) {
    sendMessage(client, "The arguments to dub cannot be empty!");
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

  if (classArgs.length !== 2 || classArgs.length !== 3) {
    sendMessage("There must be exactly two or three classes in a dub!");
    return;
  }

  const error = writeCombination(classArgs);

  if (error) {
    sendMessage(client, `Combination not recorded: ${error}`);
  } else {
    sendMessage(client, `Recorded combination: ${classArgs.join(" + ")}`);
  }
};

const deregisterHandler = async (client, msg) => {
  if (!msg.content.split(" ")[1]) {
    sendMessage(client, "The command to deregister cannot be empty!");
  }

  const command = msg.content.split(" ")[1].trim();

  if (command.startsWith(".") || command === "gaming") {
    sendMessage(client, `Cannot delete base command '${command}'`);
  } else if (Object.keys(commands).includes(command)) {
    deleteRegister(command);
    sendMessage(client, `Deleted command '${command}'`);
  } else {
    sendMessage(client, `Cannot delete unrecognized command: '${command}'`);
  }
};

const handlerMap = {
  ".help": helpHandler,
  ".register": registerHandler,
  ".deregister": deregisterHandler,
  ".dub": victoryHandler,
  ".again": againHandler,
  ".recognized-command": crawlRequestHandler,
};

module.exports = handlerMap;
