require("dotenv").config();
const path = require("path");
const {
  helpHandler,
  registerHandler,
  deregisterHandler,
} = require("./handlers/handlers");

const CHANNEL = process.env.argv.includes("--development")
  ? process.env.TEST_CHANNEL_ID
  : process.env.CHANNEL_ID;

const REGISTRY_FILEPATH = path.resolve("./register", "register.txt");

const COMMANDS = {
  ".register": {
    command: ".register",
    helpText:
      "Typing '.register <newcommand>' allows flatnite-bot to recognize <newcommand> as the cue to start gaming!",
    handler: registerHandler,
  },
  ".deregister": {
    command: ".deregister",
    helpText:
      "Typing '.deregister <command>' will delete that command from the flatnite-bot's memory. It won't be able to be used for gaming anymore!",
    handler: deregisterHandler,
  },
  ".help": {
    command: ".help",
    helpText:
      "Typing '.help' shows the list of all commands recognized by gamingbot!",
    handler: helpHandler,
  },
};

module.exports = {
  CHANNEL,
  REGISTRY_FILEPATH,
  COMMANDS,
};
