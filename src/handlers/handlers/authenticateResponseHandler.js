const { sendMessage } = require("../../message");
const { session } = require("../../store");

/**
 * Handles the command '.authentication-response <PIN>'
 * @param {import("discord.js").Message} message
 */
const authenticationResponseHandler = async (message) => {
  const user = message.author;

  const msgArray = message.content.split(" ");
  if (msgArray.length !== 2) {
    sendMessage(
      `Invalid number of arguments! Expected 1 argument and got ${
        msgArray.length - 1
      }.`
    );
    return;
  }

  if (!session.userIsInAuthenticationProcess(user)) {
    sendMessage(
      "You have not started the authentication process.\nIf you are eligible, please type '.authenticate-request' to authenticate."
    );
    return;
  }

  const pin = msgArray[1];
  if (pin !== session.getPIN(user)) {
    sendMessage("The PIN was invalid. Please try again.");
    return;
  }

  session.authenticateUser(user);
  sendMessage("You have successfully authenticated yourself!");
};

module.exports = authenticationResponseHandler;
