const _ = require("lodash");
const parseRegisters = require("../register/parseRegisters");

const REQUIRED_COMMANDS = {
  ".register": {
    command: ".register",
    helpText:
      "Typing '.register <newcommand>' allows flatnite-bot to recognize <newcommand> as the cue to start gaming!",
    helpSnippets: [".register <newcommand>"],
  },
  ".deregister": {
    command: ".deregister",
    helpText:
      "Typing '.deregister <command>' will delete that command from the flatnite-bot's memory. It won't be able to be used for gaming anymore!",
    helpSnippets: [".deregister <newcommand>"],
  },
  ".help": {
    command: ".help",
    helpText:
      "Typing '.help' shows the list of all commands recognized by gamingbot!",
    helpSnippets: [".help <command>", ".help"],
  },
  "@gaming_bot": {
    command: "@gaming_bot",
    helpText:
      "Typing '@gaming_bot' asks the gamingbot to reply.",
    helpSnippets: ["@gaming_bot <message>", "@gaming_bot"],
  },
};

const updateCommands = () => {
  const newParsed = parseRegisters();

  // Delete everything within commands while keeping the same reference
  _.forEach(commands, (command, commandKey) => {
    delete commands[commandKey];
  });

  // Add all required commands back in
  _.forEach(REQUIRED_COMMANDS, (command, commandKey) => {
    commands[commandKey] = command;
  });

  // Add all custom commands back in
  newParsed.forEach((aMsg) => {
    commands[aMsg] = {
      command: aMsg,
      helpText: "A recognized cue to begin gaming!",
      helpSnippets: [aMsg],
    };
  });
};

const commands = _.cloneDeep(REQUIRED_COMMANDS);
updateCommands();

module.exports = { commands, updateCommands };
