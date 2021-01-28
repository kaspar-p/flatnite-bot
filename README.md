# flatnite-bot
A discord bot to auto-send flatnite links when asked

## How to use it
There are three ignored files, for security:
- `ls.js` is an object that contains all localStorage data downloaded from an authenticated Surviv.io account.
- `cookies.js` is an array of objects, each of which has `name`, `value`, and `domain` keys. The three cookies for authentication MUST BE `__cfduid`, `app-sid` and `app-data`. Be sure to copy these from an authenticated Surviv.io account.
- `.env` is the configuration information for a certain discord server. The discord bot's `BOT_TOKEN` and the desired `CHANNEL_ID` live here, as well as an optional `TEST_CHANNEL_ID` for development.

The system is currently tuned for linux, but any regular PC can use this by installing the npm `chromedriver` package and using that, rather than the native chromedriver currently used.

Once all that is resolved, just run `npm install && node bot.js`! Then, the next time someone says "gaming" in the desired channel, the bot will create a lobby and send the corresponding link.
