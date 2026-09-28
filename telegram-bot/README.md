# Telegram Support Bot

A ready-to-run FAQ and human-support bot built with Telegram's Bot API. It supports `/start`, `/help`, `/faq`, and `/contact`, plus inline FAQ buttons. It does not store conversations or customer data.

This is a Telegram bot, not a custom Telegram client. It uses the Bot API; building a full client with Telegram API/TDLib requires a separate application and development work.

This is the coded bot option. The separate [no-code Make guide](../TELEGRAM_NO_CODE.md) is an alternative; use a dedicated bot token for either setup.

## Setup

1. Create a bot with [@BotFather](https://t.me/BotFather) using `/newbot` and copy the token.
2. In this directory, install dependencies:

   ```sh
   npm install
   ```

3. Copy `.env.example` to `.env`. Put the token in `TELEGRAM_BOT_TOKEN`, then set `BUSINESS_NAME` and `SUPPORT_USERNAME`.
4. Start the bot:

   ```sh
   npm start
   ```

5. Open the bot's `https://t.me/YourBotUsername` link and test each command and FAQ button.

Keep `.env` private. Never send the bot token in chat or commit it to source control. For continuous availability, deploy this process to a host that supports long-running Node.js services and set the same environment variables in its secret manager.

## Customize answers

Edit the sample FAQ copy in `src/content.js`. Update the support destination through `SUPPORT_USERNAME`; omit the leading `@` or include it, both are accepted.

Run the included checks with `npm test`.