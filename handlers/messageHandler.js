const { commands, acceptedMessages } = require("../register/registerLib");

const handleMessage = async (client, msg) => {
  // const whichMatch = () => {
  //   const matches = (command) => msg.content.startsWith(command) == true;
  //   const matchesCustom = acceptedMessages.includes(msg.content);

  //   let matchesReserved;
  //   commands.forEach((commandObj) => {
  //     if (matches(commandObj.command)) return (matchesReserved = commandObj);
  //   });

  //   if (matchesReserved) return matchesReserved.command;
  //   if (matchesCustom) return "recognized-command";
  // };

  let matchedCommand;

  Object.keys(commands).forEach((command) => {
    if (msg.content.startsWith(command)) {
      matchedCommand = command;
      return false;
    } else if (acceptedMessages.includes(msg.content)) {
      matchedCommand = "recognized-command";
      return false;
    }
  });

  //
  await commands[matchedCommand].handler(client, msg);
};

module.exports = handleMessage;
