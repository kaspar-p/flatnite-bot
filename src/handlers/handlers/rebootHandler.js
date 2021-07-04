const childProcess = require("child_process");

const { sendMessage } = require("../../message");
const { session } = require("../../store");

/**
 * Handles the command '.reboot'
 * @param {import("discord.js").Message} message
 */
const rebootHandler = async (message) => {
  const user = message.author;

  if (session.isAuthenticated(user)) {
    sendMessage("Rebooting...");
    childProcess.execSync(`./reboot.sh`);
  } else {
    sendMessage(
      "You are not authenticated. If you are eligible to authenticate, please send '.authenticate-request'."
    );
  }
};

module.exports = rebootHandler;
