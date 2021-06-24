const fs = require("fs");
const path = require("path");

const errorLogFilepath = path.resolve("./", "logs", "errors.txt");

const log = (text) => {
  fs.appendFileSync(errorLogFilepath, text + "\n");
};

module.exports = log;
