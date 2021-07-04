const { sendMessage } = require("../../message");
const { session } = require("../../store");
const { PIN_EXPIRATION_TIME } = require("../../constants");

const twilioClient = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Text the user that their PIN has been created and they can authenticate with it now
 * @param {import("discord.js").User} user The user to text, defined through a map
 * @param {string} text The message to text the user
 */
const sendText = async (user, text) => {
  const textMap = {
    "261335946123935745": process.env.THORN_NUMBER,
  };

  // Text the user
  await twilioClient.messages.create({
    body: text,
    from: process.env.GAMINGBOT_NUMBER,
    to: textMap[user.id],
  });
};

/**
 * Handles the command '.authenticate-request'
 * @param {import("discord.js").Message} message
 */
const authenticateRequestHandler = async (message) => {
  const user = message.author;

  if (!session.userCanAuthenticate(user)) {
    sendMessage(
      "Unfortunately, you do not have the permissions to be able to perform this request. There is nothing you can do to change this."
    );
    return;
  }

  if (session.userIsInAuthenticationProcess(user)) {
    sendMessage(
      "You are already in the authentication process. Please complete that first."
    );
    return;
  }

  // The user can authenticate

  const pin = session.startAuthenticationProcess(user);

  const timeInMinutes = PIN_EXPIRATION_TIME / (60 * 1000);

  sendText(
    user,
    `You PIN is: ${pin}. It expires in ${timeInMinutes} minute${
      timeInMinutes === 1 ? "" : "s"
    }.`
  );

  sendMessage(
    "You are eligible to authenticate. A text has been sent to your phone. Please type '.authenticate-response <PIN>' with the PIN received to authenticate."
  );
};

module.exports = authenticateRequestHandler;
