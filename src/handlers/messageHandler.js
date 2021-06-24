const _ = require("lodash");

const { availability, commands } = require("../store");
const handlerMap = require("./handlerMap");
const { sendMessage } = require("../message");
const log = require("../../logs/logging");
const { MODE } = require("../constants");

const runHandler = async (keyword, client, msg) => {
  try {
    await handlerMap[keyword](client, msg);
  } catch (error) {
    console.log("Error occurred: ", error);
    log(error);
    sendMessage(client, "Error occurred! Request went unprocessed!");
  }
};

const handleMessage = async (client, msg) => {
  let command;

  _.forEach(commands, (testCommand) => {
    if (msg.content.startsWith(testCommand.command)) command = testCommand;
  });

  if (!command) {
    // Just a regular message not for the bot
    return;
  }

  if (!availability.ready) {
    sendMessage(
      client,
      "Bot is working hard with tears streaming down its face.\n" +
        "Please wait a few minutes for the bot to be ready for gaming."
    );
    return;
  }

  if (command.type === "crawl") {
    if (MODE.DEVELOP_MSG) {
      sendMessage(client, "Cannot crawl in message development mode!");
      return;
    }

    let kw;
    if (command.command.startsWith(".")) kw = command.command;
    else kw = ".recognized-command";

    availability.setReady(false);
    await runHandler(kw, client, msg);
    availability.setReady(true);
  } else {
    await runHandler(command.command, client, msg);
  }
};

module.exports = handleMessage;
