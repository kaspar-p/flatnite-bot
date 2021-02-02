const fs = require("fs");
const registerLib = require("./registerLib");
const { REGISTRY_FILEPATH } = require("../constants");

const writeRegister = (newRegister) => {
  newRegister = newRegister.toString().trim();

  const registers = registerLib.parseRegisters();

  if (!registers.includes(newRegister)) {
    fs.appendFileSync(REGISTRY_FILEPATH, "\n" + newRegister);
    registerLib.updateAcceptableMessages();
  }
};

const deleteRegister = (registerToDelete) => {
  const data = fs.readFileSync(REGISTRY_FILEPATH, { encoding: "utf-8" });
  const dataRows = data.split("\n");

  const index = dataRows.indexOf(registerToDelete);
  dataRows.splice(index, 1);

  const newFile = dataRows.join("\n");
  fs.writeFileSync(REGISTRY_FILEPATH, newFile, { encoding: "utf-8" });
};

const checkValidation = (newRegister) => {
  if (!newRegister) {
    return {
      isValid: false,
      errorMessages: ["New command cannot be empty!"],
    };
  }

  // Returns the validation status of the new register
  const requirements = registerLib.requirements(newRegister);

  const errorMessages = [];

  for (const violationSet of requirements) {
    const passes = violationSet.requirement.reduce(
      (pass, current) => pass && current,
      true
    );

    if (!passes) {
      errorMessages.push(violationSet.violation);
    }
  }

  return { isValid: errorMessages.length === 0, errorMessages };
};

module.exports = { writeRegister, checkValidation, deleteRegister };
