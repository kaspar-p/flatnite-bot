const { extendObservable, autorun, action, makeObservable } = require("mobx");
const fs = require("fs");
const _ = require("lodash");

const { REGISTRY_FILEPATH } = require("../constants");

class Command {
  constructor({ command, helpText, helpSnippets, type }) {
    this.command = command;
    this.helpText = helpText;
    this.helpSnippets = helpSnippets;
    this.type = type;
  }
}

class GamingCommand extends Command {
  constructor(command) {
    super({
      command,
      helpText: "A recognized cue to begin gaming!",
      helpSnippets: [command],
      type: "crawl",
    });
  }
}

const REQUIRED_COMMANDS = {
  ".register": new Command({
    command: ".register",
    helpText:
      "Typing '.register <newcommand>' allows flatnite-bot to recognize <newcommand> as the cue to start gaming!",
    helpSnippets: [".register <newcommand>"],
    type: "msg",
  }),
  ".deregister": new Command({
    command: ".deregister",
    helpText:
      "Typing '.deregister <command>' will delete that command from the flatnite-bot's memory. It won't be able to be used for gaming anymore!",
    helpSnippets: [".deregister <newcommand>"],
    type: "msg",
  }),
  ".help": new Command({
    command: ".help",
    helpText:
      "Typing '.help' shows the list of all commands recognized by gamingbot!",
    helpSnippets: [".help <command>", ".help"],
    type: "msg",
  }),
  ".again": new Command({
    command: ".again",
    helpText:
      "Typing '.again <number-of-players>' will generate a new flatnite combination for you to try!",
    helpSnippets: [".again <number-of-players>"],
    type: "msg",
  }),
  ".dub": new Command({
    command: ".dub",
    helpText:
      "Typing '.dub <class1> <class2> <class3>' stores that combination to the datastore!",
    helpSnippets: [".dub <class1> <class2> <class3>"],
    type: "msg",
  }),
  ".mode": new Command({
    command: ".mode",
    helpText: "Typing '.mode' tells you the special mode for today!",
    helpSnippets: [".mode"],
    type: "crawl",
  }),
  ".refresh": new Command({
    command: ".refresh",
    helpText: "Typing '.refresh' refreshes the page (for debugging)!",
    helpSnippets: [".refresh"],
    type: "crawl",
  }),
  ".query": new Command({
    command: ".query",
    helpText:
      "Typing '.query <class1> <class2> <class3>' tells you whether or not that combination has already been completed!",
    helpSnippets: [".query <class1> <class2> <class3>"],
    type: "msg",
  }),
  ".how-many": new Command({
    command: ".how-many",
    helpText:
      "Typing '.how-many' will tells you how many runs of statistical analysis gamingbot has done!",
    helpSnippets: [".how-many"],
    type: "msg",
  }),
  ".speak": new Command({
    command: ".speak",
    helpText: "Typing '.speak' will make gamingbot go absolutely ham nuts.",
    helpSnippets: [".speak"],
    type: "msg",
  }),
};

class CommandStore {
  constructor() {
    makeObservable(this, {
      addCommand: action,
      deleteCommand: action,
    });

    autorun(() => this.updateCommands());
    console.log(this);
  }

  addCommand(command) {
    // Add to file
    const registers = this.parseRegisters();
    if (!registers.includes(command)) {
      fs.appendFileSync(REGISTRY_FILEPATH, "\n" + command);
    }

    // Add to in-memory store
    extendObservable(this, {
      [command]: new GamingCommand(command),
    });
  }

  deleteCommand(command) {
    // Delete from file
    const data = fs.readFileSync(REGISTRY_FILEPATH, { encoding: "utf-8" });
    const dataRows = data.split("\n");

    const index = dataRows.indexOf(command);
    dataRows.splice(index, 1);

    const newFile = dataRows.join("\n");
    fs.writeFileSync(REGISTRY_FILEPATH, newFile, { encoding: "utf-8" });

    // Delete from in-memory store
    this[command] = undefined;
  }

  /**
   * Parses the commands saved in REGISTRY_FILEPATH as new GamingCommand's
   * @returns {Array<String>} An array of commands that will become GamingCommands
   */
  parseRegisters() {
    const registers = [];

    const data = fs.readFileSync(REGISTRY_FILEPATH, { encoding: "utf-8" });
    data.split("\n").forEach((row) => {
      const value = row.trim();

      if (!registers.includes(value) && value) registers.push(value);
    });

    return registers;
  }

  updateCommands() {
    // Add all non-custom commands back in
    _.forEach(REQUIRED_COMMANDS, (commandInfo, commandKey) =>
      extendObservable(this, {
        [commandKey]: new Command(commandInfo),
      })
    );

    const gamingCommands = this.parseRegisters();

    // Add all custom commands back in
    gamingCommands.forEach((gamingCommand) =>
      extendObservable(this, {
        [gamingCommand]: new GamingCommand(gamingCommand),
      })
    );
  }

  /**
   *
   * @returns
   */
  getFormattedHelpTexts() {
    const helpTexts = [];
    _.forEach(this, (object) => {
      if (object instanceof Command) {
        helpTexts.push(" -> " + object.command + "\n");
      }
    });

    return helpTexts.join("");
  }
}

module.exports = new CommandStore();
