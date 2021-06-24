require("dotenv").config();
const path = require("path");

const MODE = {
  DEVELOP_WEB: process.argv.includes("--develop-web"),
  DEVELOP_MSG: process.argv.includes("--develop-msg"),
};
MODE.DEVELOP = MODE.DEVELOP_MSG || MODE.DEVELOP_WEB;
MODE.PRODUCTION = !(MODE.DEVELOP_MSG || MODE.DEVELOP_WEB);

const CHANNEL = MODE.DEVELOP
  ? process.env.TEST_CHANNEL_ID
  : process.env.CHANNEL_ID;

const REGISTRY_FILEPATH = path.resolve("./register", "registers.txt");

const CLASSES = ["demo", "tank", "scout", "medic", "assault", "sniper"];
const PRIMES = [2n, 3n, 5n, 7n, 11n, 13n];
const classInvariants = {};
const inverseClassInvariants = {};

PRIMES.forEach((prime, index) => {
  classInvariants[CLASSES[index]] = prime;
  inverseClassInvariants[prime] = CLASSES[index];
});

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
  REQUIREMENTS,
  PRIMES,
  CLASSES,
  classInvariants,
  inverseClassInvariants,
};
