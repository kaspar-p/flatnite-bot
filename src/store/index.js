const AvailabilityStore = require("./Availability");
const CommandStore = require("./Commands");
const ClientStore = require("./Client");
const SessionStore = require("./Session");

module.exports = {
  clientStore: ClientStore,
  commands: CommandStore,
  availability: AvailabilityStore,
  session: SessionStore,
};
