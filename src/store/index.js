const AvailabilityStore = require("./Availability");
const CommandStore = require("./Commands");
const ClientStore = require("./Client");

module.exports = {
  availability: AvailabilityStore,
  commands: CommandStore,
  client: ClientStore,
};
