const AvailabilityStore = require("./Availability");
const CommandStore = require("./Commands");
const ClientStore = require("./Client");
const SessionStore = require("./Session");

module.exports = {
  availability: AvailabilityStore,
  commands: CommandStore,
  client: ClientStore,
  session: SessionStore,
};
