const { writeRegister, checkValidation } = require("./register/register");
const { handleUserInput } = require("./crawl");
const { commands, acceptedMessages } = require("./register/registerLib");
const available = require("./balancer");

const sendMessage = (client, text) => {
  const channel = client.channels.cache.get(process.env.TEST_CHANNEL_ID);
  channel.send(text);
};

const handleMessage = async (client, msg) => {
  console.log(msg.content, msg.content.startsWith(".help") == true);

  const whichMatch = () => {
    const matches = (command) => msg.content.startsWith(command) == true;
    const matchesAccepted = acceptedMessages.includes(msg.content);

    if (matches(".register")) return ".register";
    if (matches(".help")) return ".help";
    if (matchesAccepted) return "recognized-command";
  };

  switch (whichMatch()) {
    case ".register":
      console.log("Register handler called.");
      await registerHandler(client, msg);
      break;
    case ".help":
      console.log("Help handler called.");
      await helpHandler(client, msg);
      break;
    case "recognized-command":
      console.log("Crawl request handler called.");
      await crawlRequestHandler(client, msg);
      break;
    default:
      break;
  }
};

const crawlRequestHandler = async (client, msg) => {
  const rightChannel = msg.channel.id === process.env.TEST_CHANNEL_ID;

  console.log("accepted messages: ", acceptedMessages);

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

module.exports = handleMessage;
