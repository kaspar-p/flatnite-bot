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
  ".again": {
    command: ".again",
    helpText:
      "Typing '.again <number-of-players>' will generate a new flatnite combination for you to try!",
    helpSnippets: [".again <number-of-players>"],
  },
  ".dub": {
    command: ".dub",
    helpText:
      "Typing '.dub <class1> <class2> <class3>' stores that combination to the datastore!",
    helpSnippets: [".dub <class1> <class2> <class3>"],
  },
  ".mode": {
    command: ".mode",
    helpText: "Typing '.mode' tells you the special mode for today!",
    helpSnippets: [".mode"],
  },
  ".refresh": {
    command: ".refresh",
    helpText: "Typing '.refresh' refreshes the page (for debugging)!",
    helpSnippets: [".refresh"],
  },
  ".query": {
    command: ".query",
    helpText:
      "Typing '.query <class1> <class2> <class3>' tells you whether or not that combination has already been completed!",
    helpSnippets: [".query <class1> <class2> <class3>"],
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
