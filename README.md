# flatnite-bot

A Surviv.io helpbot. Send lobby links, records cobalt win combinations, and is cute.

## How to use it

There are three ignored files, for security:

- `/auth/ls.js` is an object that contains all localStorage data downloaded from an authenticated Surviv.io account.
- `/auth/cookies.js` is an array of objects, each of which has `name`, `value`, and `domain` keys. The three cookies for authentication MUST BE `__cfduid`, `app-sid` and `app-data`. Be sure to copy these from an authenticated Surviv.io account.
- `.env` is the configuration information for a certain discord server. The discord bot's `BOT_TOKEN` and the desired `CHANNEL_ID` live here, as well as an optional `TEST_CHANNEL_ID` for development.

The system is currently tuned for Linux, but any regular PC can use this by installing the npm `chromedriver` package and using that, rather than the native chromedriver currently used.

This works well on the author's Mac and Linux machines. Please open an issue if setup is failing with a different configuration.

Once all that is resolved, just run `npm install && npm run flatnite-bot`! Then, the next time someone says "gaming" in the desired channel, the bot will create a lobby and send the corresponding link.

## How to test it

Be sure to have a `TEST_CHANNEL_ID` in the `.env` file. Then, run `npm install && npm run develop`, and rather than using the production channel, the bot will use the test channel for listening and its responses.

## Future changes

- Get the bot its very own Surviv.io account so it can stop leeching off of kaspar-p's.
- Use a free database like mongoDB or other in order to separate possible servers, rather than just saving results to the local filesystem.
- Queue requests for a flatnite link while it is working, so that as soon as it is finished working, it can send one without the user needing to re-request a link.
- Get the bot to automatically recognize the players playing in the lobby it created, and choose which file to save their dubs under with that.
