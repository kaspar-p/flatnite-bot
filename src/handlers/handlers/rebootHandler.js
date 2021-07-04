const childProcess = require("child_process");

const { sendMessage } = require("../../message");
const { session } = require("../../store");

/**
 * Handles the command '.reboot'
 * @param {import("discord.js").Message} message
 */
const rebootHandler = async (message) => {
  const userID = message.author.id;

  if (session.isAuthenticated(userID)) {
    sendMessage("Rebooting...");
    childProcess.execSync(`sudo reboot`);
  } else {
    sendMessage(
      "You are not authenticated. If you are eligible to authenticate, please send '.authenticate-request'."
    );
  }
};

module.exports = rebootHandler;
