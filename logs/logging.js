const fs = require("fs");

const errorLogFilepath = "./errors.txt";

const log = (text) => {
  fs.appendFileSync(errorLogFilepath, text + "\n");
};

module.exports = log;
