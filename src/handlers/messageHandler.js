const _ = require("lodash");

const { availability, commands } = require("../store");
const handlerMap = require("./handlerMap");
const { sendMessage } = require("../message");
const log = require("../../logs/logging");
const { MODE } = require("../constants");

/**
 * Runs the specific handler
 * @param {string} keyword The name of the handler defined in handlerMap
 * @param {import("discord.js").Message} msg The original message the user sent
 */
const runHandler = async (keyword, msg) => {
  try {
    await handlerMap[keyword](msg);
  } catch (error) {
    console.log("Error occurred: ", error);
    log(error);
    sendMessage("Error occurred! Request went unprocessed!");
  }
};

/**
 * Handle all messages, redirecting them based on their command
 * @param {import("discord.js").Message} msg
 */
const handleMessage = async (msg) => {
  let command;

  _.forEach(commands, (testCommand) => {
    if (msg.content.startsWith(testCommand.command)) command = testCommand;
  });

  if (!command) {
    // Just a regular message, not for the bot
    return;
  }

  if (!availability.ready) {
    sendMessage(
      "Bot is working hard with tears streaming down its face.\n" +
        "Please wait a few minutes for the bot to be ready for gaming."
    );
    return;
  }

  if (command.type === "crawl") {
    if (MODE.DEVELOP_MSG) {
      sendMessage("Cannot crawl in message development mode!");
      return;
    }

    const kw = command.command.startsWith(".")
      ? command.command
      : ".recognized-command";

    availability.setReady(false);
    await runHandler(kw, msg);
    availability.setReady(true);
  } else {
    await runHandler(command.command, msg);
  }
};

module.exports = handleMessage;
