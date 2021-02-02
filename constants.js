require("dotenv").config();
const path = require("path");

const CHANNEL = process.env.argv.includes("--development")
  ? process.env.TEST_CHANNEL_ID
  : process.env.CHANNEL_ID;

const REGISTRY_FILEPATH = path.resolve("./register", "register.txt");

module.exports = {
  CHANNEL,
  REGISTRY_FILEPATH,
};
