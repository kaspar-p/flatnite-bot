require("dotenv").config();
const path = require("path");

const MODE = {
  DEVELOP_WEB: process.argv.includes("--develop-web"),
  DEVELOP_MSG: process.argv.includes("--develop-msg"),
};
MODE.DEVELOP = MODE.DEVELOP_MSG || MODE.DEVELOP_WEB;
MODE.PRODUCTION = !MODE.DEVELOP;

const CHANNEL = MODE.DEVELOP
  ? process.env.TEST_CHANNEL_ID
  : process.env.CHANNEL_ID;

const REGISTRY_FILEPATH = path.resolve("src", "data", "registers.txt");

const CLASSES = ["demo", "tank", "scout", "medic", "assault", "sniper"];
// The max number of simultaneous players at a time
const CLASSES_LIMIT = 50;
const PRIMES = [2n, 3n, 5n, 7n, 11n, 13n];
const classInvariants = {};
const inverseClassInvariants = {};

PRIMES.forEach((prime, index) => {
  classInvariants[CLASSES[index]] = prime;
  inverseClassInvariants[prime] = CLASSES[index];
});

const AUTHENTICATION_PIN_LENGTH = 5;
const PIN_EXPIRATION_TIME = 1 * 60 * 1000;

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
  (newRegister) => ({
    requirement: [!newRegister.includes(".")],
    violation: "New command cannot contain periods!",
  }),
];

module.exports = {
  MODE,
  CHANNEL,
  REGISTRY_FILEPATH,
  AUTHENTICATION_PIN_LENGTH,
  PIN_EXPIRATION_TIME,
  REQUIREMENTS,
  PRIMES,
  CLASSES,
  CLASSES_LIMIT,
  classInvariants,
  inverseClassInvariants,
};
