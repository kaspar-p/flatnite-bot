const fs = require("fs");
const { commands, updateCommands } = require("../constants/commands");
const parseRegisters = require("./parseRegisters");
const { REGISTRY_FILEPATH, REQUIREMENTS } = require("../constants/constants");

const writeRegister = (uncleanRegister) => {
  const newRegister = uncleanRegister.toString().trim();

  const registers = parseRegisters();

  if (!registers.includes(newRegister)) {
    fs.appendFileSync(REGISTRY_FILEPATH, "\n" + newRegister);
    updateCommands();
  }
};

const deleteRegister = (registerToDelete) => {
  const data = fs.readFileSync(REGISTRY_FILEPATH, { encoding: "utf-8" });
  const dataRows = data.split("\n");

  const index = dataRows.indexOf(registerToDelete);
  dataRows.splice(index, 1);

  const newFile = dataRows.join("\n");
  fs.writeFileSync(REGISTRY_FILEPATH, newFile, { encoding: "utf-8" });
  updateCommands();
};

const checkValidation = (newRegister) => {
  if (!newRegister) {
    return {
      isValid: false,
      errorMessages: ["New command cannot be empty!"],
    };
  }

  // Returns the validation status of the new register

  const errorMessages = [];

  REQUIREMENTS.forEach((violationSet) => {
    const test = violationSet(newRegister);
    const passes = test.requirement.reduce(
      (pass, current) => pass && current,
      true,
    );

    if (!passes) {
      errorMessages.push(test.violation);
    }
  });

  if (commands.length >= 50) {
    errorMessages.push("There cannot be more than 50 commands!");
  }

  return { isValid: errorMessages.length === 0, errorMessages };
};

module.exports = {
  writeRegister,
  checkValidation,
  parseRegisters,
  deleteRegister,
};
