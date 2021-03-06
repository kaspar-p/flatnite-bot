const helpHandler = require("./handlers/helpHandler");
const registerHandler = require("./handlers/registerHandler");
const deregisterHandler = require("./handlers/deregisterHandler");
const victoryHandler = require("./handlers/victoryHandler");
const againHandler = require("./handlers/againHandler");
const modeHandler = require("./handlers/modeHandler");
const refreshHandler = require("./handlers/refreshHandler");
const queryHandler = require("./handlers/queryHandler");
const howManyHandler = require("./handlers/howManyHandler");
const speakHandler = require("./handlers/speakHandler");
const crawlHandler = require("./handlers/crawlHandler");
const rebootHandler = require("./handlers/rebootHandler");
const authenticateRequestHandler = require("./handlers/authenticateRequestHandler");
const authenticationResponseHandler = require("./handlers/authenticateResponseHandler");

module.exports = {
  ".help": helpHandler,
  ".register": registerHandler,
  ".deregister": deregisterHandler,
  ".dub": victoryHandler,
  ".again": againHandler,
  ".mode": modeHandler,
  ".refresh": refreshHandler,
  ".query": queryHandler,
  ".how-many": howManyHandler,
  ".speak": speakHandler,
  ".reboot": rebootHandler,
  ".authenticate-request": authenticateRequestHandler,
  ".authenticate-response": authenticationResponseHandler,
  ".recognized-command": crawlHandler,
};
