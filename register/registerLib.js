const fs = require("fs");
const _ = require("lodash");
const { REGISTRY_FILEPATH, COMMANDS } = require("../constants");
const { crawlRequestHandler } = require("../handlers/handlers");

const parseRegisters = () => {
  const registers = [];

  const data = fs.readFileSync(REGISTRY_FILEPATH, { encoding: "utf-8" });
  data.split("\n").forEach((row) => {
    const value = row.trim();

    if (!registers.includes(value)) registers.push(value);
  });

  return registers;
};

let updateCommands = () => {
  acceptedMessages.forEach((aMsg) => {
    commands[aMsg] = {
      command: aMsg,
      helpText: "A recognized cue to begin gaming!",
      handler: crawlRequestHandler,
    };
  });
};

let acceptedMessages = parseRegisters();
const updateAcceptableMessages = () => {
  let newParsed = parseRegisters();
  for (let p of newParsed) {
    acceptedMessages[newParsed.indexOf(p)] = p;
  }
  updateCommands();
};

let commands = _.cloneDeep(COMMANDS);
updateCommands();

const requirements = (newRegister) => [
  {
    requirement: [newRegister.length < 30],
    violation: "New command is too long!",
  },
  {
    requirement: [newRegister.length > 1],
    violation: "New command is too short!",
  },
  {
    requirement: [
      !newRegister.includes(" "),
      !newRegister.includes("\n"),
      !newRegister.includes("\r"),
    ],
    violation: "New command cannot include spaces or newlines!",
  },
  {
    requirement: [
      !newRegister.includes('"'),
      !newRegister.includes("'"),
      !newRegister.includes("`"),
    ],
    violation: "New command cannot include string delimiter characters!",
  },
  {
    requirement: [!newRegister.includes("\\")],
    violation: "New command cannot include a backslash!",
  },
  {
    requirement: [
      !newRegister.includes(".register"),
      !newRegister.includes(".help"),
    ],
    violation: "New command cannot contain control commands!",
  },
];

module.exports = {
  parseRegisters,
  commands,
  requirements,
  acceptedMessages,
  updateAcceptableMessages,
};
