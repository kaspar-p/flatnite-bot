require("dotenv").config();
const path = require("path");

const CHANNEL = process.argv.includes("--development")
  ? process.env.TEST_CHANNEL_ID
  : process.env.CHANNEL_ID;

const REGISTRY_FILEPATH = path.resolve("./register", "registers.txt");

const CLASSES = ["demo", "tank", "scout", "medic", "assault", "sniper"];

const REQUIREMENTS = [
  (newRegister) => ({
    requirement: [newRegister.length < 30],
    violation: "New command is too long!",
  }),
  (newRegister) => ({
    requirement: [newRegister.length > 1],
    violation: "New command is too short!",
  }),
  (newRegister) => ({
    requirement: [
      !newRegister.includes(" "),
      !newRegister.includes("\n"),
      !newRegister.includes("\r"),
    ],
    violation: "New command cannot include spaces or newlines!",
  }),
  (newRegister) => ({
    requirement: [
      !newRegister.includes('"'),
      !newRegister.includes("'"),
      !newRegister.includes("`"),
    ],
    violation: "New command cannot include string delimiter characters!",
  }),
  (newRegister) => ({
    requirement: [!newRegister.includes("\\")],
    violation: "New command cannot include a backslash!",
  }),
  (newRegister) => ({
    requirement: [
      !newRegister.includes(".register"),
      !newRegister.includes(".help"),
    ],
    violation: "New command cannot contain control commands!",
  }),
];

module.exports = {
  CHANNEL,
  REGISTRY_FILEPATH,
  REQUIREMENTS,
  CLASSES,
};
