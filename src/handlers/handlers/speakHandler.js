const { sendMessage } = require("../../message");

const speakHandler = async () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const numLetters = 40;
  const probability = 0.25;

  let sentence = "";
  for (let i = 0; i < numLetters; i++) {
    sentence += alphabet[Math.floor(Math.random() * alphabet.length)];
    if (Math.random() < probability) {
      sentence += " ";
    }
  }

  sendMessage(sentence);
};

module.exports = speakHandler;
