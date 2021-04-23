const fs = require("fs");
const { REGISTRY_FILEPATH } = require("../constants/constants");

const parseRegisters = () => {
  const registers = [];

  const data = fs.readFileSync(REGISTRY_FILEPATH, { encoding: "utf-8" });
  data.split("\n").forEach((row) => {
    const value = row.trim();

    if (!registers.includes(value) && value) registers.push(value);
  });

  return registers;
};

module.exports = parseRegisters;
