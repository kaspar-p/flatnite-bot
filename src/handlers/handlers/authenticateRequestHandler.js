const { sendMessage } = require("../../message");
const { session } = require("../../store");
const { AUTHENTICATION_PIN_LENGTH } = require("../../constants");

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
    "Thorn#9752": process.env.THORN_NUMBER,
  };

  // Text the user
  await twilioClient.create({
    body: text,
    from: process.env.GAMINGBOT_NUMBER,
    to: textMap[user.id],
  });

  console.log("text sent to: ", user.id);
};

/**
 * Creates a random numeric PIN (as a string)
 * @returns {string}
 */
const createPIN = () => {
  const alphabet = "0123456789";

  let pin = "";
  for (let i = 0; i < AUTHENTICATION_PIN_LENGTH; i++) {
    pin += alphabet[Math.floor(Math.random * alphabet.length)];
  }

  return pin;
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

  if (session.isUserInAuthenticationProcess(user)) {
    sendMessage(
      "You are already in the authentication process. Please complete that first."
    );
    return;
  }

  // The user can authenticate

  session.setUserAuthenticating(user);

  const pin = createPIN();
  session.setAuthenticationPIN(user, pin);

  sendText(user, `You PIN is: ${pin}. It expires in 10 minutes.`);

  const tenMinutes = 10 * 60 * 1000;

  setTimeout(() => {
    this.clearAuthenticationPIN(user);
    this.clearUserAuthenticating(user);
  }, tenMinutes);

  sendMessage(
    "You are eligible to authenticate. A text has been sent to your phone. Please type '.authentication-response <PIN>' with the PIN received to authenticate."
  );
};

module.exports = authenticateRequestHandler;
