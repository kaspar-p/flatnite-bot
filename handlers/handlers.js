const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const { commands } = require("../constants/commands");
const { handleUserInput, refreshSite } = require("../crawl");
const { CHANNEL, CLASSES } = require("../constants/constants");
const {
  writeRegister,
  deleteRegister,
  checkValidation,
} = require("../register/register");
const { sendMode, sendMessage, addMessageContent } = require("../message");
const {
  writeCombination,
  createCombination,
  getExistingCombinations,
  isIn,
} = require("../victory/lib");

const crawlRequestHandler = async (client, msg) => {
  const rightChannel = msg.channel.id === CHANNEL;
  const rightMessage = msg.content in commands;

  if (rightChannel && rightMessage) {
    // Create a flatnite lobby and send the link
    const message = await sendMessage(client, "Get in here nerds: ");
    const link = await handleUserInput();
    await addMessageContent(message, link);
  }
};

const helpHandler = async (client, msg) => {
  const string = msg.content;
  const argument = string.split(" ").length > 1 ? string.split(" ")[1] : null;

  if (argument) {
    if (Object.keys(commands).includes(argument)) {
      sendMessage(
        client,
        `Command: '${argument}' -> ${commands[argument].helpText}`,
      );
    } else {
      sendMessage(
        client,
        "Unknown command! Try '.help' with no arguments to learn all recognized commands!",
      );
    }
  } else {
    const allHelpSnippets = [];
    _.forEach(commands, (commandObject) => {
      allHelpSnippets.push(...commandObject.helpSnippets);
    });

    const formatted = allHelpSnippets.map((e) => `-> ${e}`).join("\n");

    sendMessage(client, `Available commands:\n${formatted}`);
  }
};

const queryHandler = async (client, msg) => {
  // This is a little susceptible to empty strings
  const num = msg.content.split(" ").length - 1;
  if (num !== 2 && num !== 3) {
    sendMessage(client, `Number of players must be either 2 or 3!`);
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

  if (isIn(alreadyCompleted, combination)) {
    sendMessage(client, `You have won with this combination before.`);
  } else {
    sendMessage(client, `You have NOT won with this combination before.`);
  }
};

const refreshHandler = async (client) => {
  await sendMessage(client, "Refreshing...");
  await refreshSite();
};

const modeHandler = async (client) => {
  await sendMode(client);
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

  const validationReport = checkValidation(newRegister);
  if (validationReport.isValid) {
    writeRegister(newRegister);
    sendMessage(
      client,
      `Command: '${newRegister}' registered for a gamers' use.`,
    );
  } else {
    sendMessage(
      client,
      `${
        validationReport.errorMessages.length
      } errors returned: \n${validationReport.errorMessages
        .map((errorText) => `-> ${errorText}`)
        .join("\n")}`,
    );
  }
};

const againHandler = async (client, msg) => {
  const playerNumArg = msg.content.split(" ")[1];

  if (!playerNumArg || isNaN(parseInt(playerNumArg))) {
    sendMessage(
      client,
      `Number of players input '${playerNumArg}' is not valid.`,
    );
    return;
  }

  const num = parseInt(playerNumArg);
  if (num !== 2 && num !== 3) {
    sendMessage(client, `Number of players must be either 2 or 3!`);
    return;
  }

  // Send the user a new combination to try
  const [newCombination, message] = createCombination(num);

  sendMessage(client, message);

  if (num === 3) {
    sendMessage(
      client,
      `Try this: 
        -> [6krill] player1: ${newCombination[0].toUpperCase()}
        -> [6krill] player2: ${newCombination[1].toUpperCase()}
        -> [6krill] player3: ${newCombination[2].toUpperCase()} 
      `,
    );
  } else {
    sendMessage(
      client,
      `Try this:
        -> [6krill] player1: ${newCombination[0].toUpperCase()}
        -> [6krill] player2: ${newCombination[1].toUpperCase()}
      `,
    );
  }
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

  if (classArgs.length !== 2 && classArgs.length !== 3) {
    sendMessage(client, "There must be exactly two or three classes in a dub!");
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

const speakHandler = async (client) => {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";

  let sentence = "";
  for (let i = 0; i < 20; i++) {
    sentence += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  sendMessage(client, sentence);
};

const howManyHandler = async (client) => {
  const linksPath = path.join(process.env.PWD, "/analysis/data/links.txt");

  const linksData = fs.readFileSync(linksPath, {
    encoding: "utf-8",
  });

  const links = linksData
    .trim()
    .split("\n")
    .map((row) => row.trim());

  const specificNumberLinks = (n) =>
    links.filter((link) => link.length === n).length;
  const toPercentage = (n) => ((n / links.length) * 100).toFixed(4);

  const numZero = specificNumberLinks(0);
  const zeroPercentage = toPercentage(numZero);

  const numOne = specificNumberLinks(1);
  const onePercentage = toPercentage(numOne);

  const numTwo = specificNumberLinks(2);
  const twoPercentage = toPercentage(numTwo);

  const numThree = specificNumberLinks(3);
  const threePercentage = toPercentage(numThree);

  const numFour = specificNumberLinks(4);
  const fourPercentage = toPercentage(numFour);

  sendMessage(
    client,
    `Links of length 0  :::  ${numZero} / ${links.length} = ${zeroPercentage}\n` +
      `Links of length 1  :::  ${numOne} / ${links.length} = ${onePercentage}\n` +
      `Links of length 2  :::  ${numTwo} / ${links.length} = ${twoPercentage}\n` +
      `Links of length 3  :::  ${numThree} / ${links.length} = ${threePercentage}\n` +
      `Links of length 4  :::  ${numFour} / ${links.length} = ${fourPercentage}`,
  );
};

const handlerMap = {
  ".help": helpHandler,
  ".register": registerHandler,
  ".deregister": deregisterHandler,
  ".dub": victoryHandler,
  ".again": againHandler,
  ".mode": modeHandler,
  ".refresh": refreshHandler,
  ".query": queryHandler,
  ".how-many": howManyHandler,
  ".speak": speakHandler,
  ".recognized-command": crawlRequestHandler,
};

module.exports = { handlerMap, sendMessage };
