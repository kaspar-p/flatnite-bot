# flatnite-bot

A discord bot that automatically send Surviv.io links when prompted.

## How to use it

There are three ignored files, for security:

- `/auth/ls.js` is an object that contains all localStorage data downloaded from an authenticated Surviv.io account.
- `/auth/cookies.js` is an array of objects, each of which has `name`, `value`, and `domain` keys. The three cookies for authentication MUST BE `__cfduid`, `app-sid` and `app-data`. Be sure to copy these from an authenticated Surviv.io account.
- `.env` is the configuration information for a certain discord server. The discord bot's `BOT_TOKEN` and the desired `CHANNEL_ID` live here, as well as an optional `TEST_CHANNEL_ID` for development.

The system is currently tuned for linux, but any regular PC can use this by installing the npm `chromedriver` package and using that, rather than the native chromedriver currently used.

Once all that is resolved, just run `npm install && npm run flatnite-bot`! Then, the next time someone says "gaming" in the desired channel, the bot will create a lobby and send the corresponding link.

## Future changes

First, I'd like users to be able to register new command words that the bot can listen to. This will come with two extra commands, `.register` and `.help` that users can put into any channel the bot is active in.

With this new registration, the bot should be able to differentiate operating systems. It is currently built for linux by using the native `chromedriver` package with `sudo apt-get install chromedriver`, but PC and Mac versions should be able to run with the `npm` package `chromedriver`, which doesn't require an operating side install. This way, any `npm install` will get all necessary technology needed to run the bot.

Also, it currently runs on my personal Surviv.io account, and I'd like it to have its own someday.
