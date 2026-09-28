# Telegram FAQ Bot Without Coding

This recipe creates a working FAQ and support-routing bot with Telegram's Bot API, BotFather, and Make's visual scenario builder. It answers common questions and directs people to a human support account. No code or server is required.

This is a separate alternative to the runnable Node.js bot in [`telegram-bot/`](telegram-bot/README.md). Use a dedicated token for this Make scenario; do not run both setups with the same bot.

## Which Telegram API?

The [official API overview](https://core.telegram.org/api) describes different tools, not one no-code API connection:

- **Bot API:** for bots. This is the right choice for this no-code FAQ workflow; a visual automation service such as Make can receive updates and send replies.
- **Telegram API and TDLib:** for building a custom Telegram client. TDLib handles much of the protocol, encryption, and local storage, but the application, authentication flow, and interface still need to be developed. A visual bot builder cannot provide the full client API without coding.
- **Gateway API:** for businesses sending Telegram verification codes. Use it only if your no-code platform has a supported Gateway integration; otherwise an API integration needs development.
- **Telegram Widgets:** limited website embeds, such as login or sharing, not a full Telegram client or bot workflow.

So this guide builds a no-code Bot API application; it does not implement every Telegram API method or create a custom Telegram client. A full client app with no coding is not a realistic supported path. For the official MTProto client API, see [Getting Started](https://core.telegram.org/api/obtaining_api_id) and [TDLib](https://core.telegram.org/tdlib).

## What the bot does

- `/start` and `/help` introduce the bot and list available commands.
- `/faq` returns your frequently asked questions.
- `/contact` links to your human support account.
- Any other message returns the command list.

The FAQ text is static. The bot does not collect or save customer details.

## 1. Create the bot in Telegram

1. Open Telegram and start a chat with [@BotFather](https://t.me/BotFather).
2. Send `/newbot`, then follow the prompts for a display name and a unique username ending in `bot`.
3. Keep the bot token private. Enter it only in Make's Telegram connection; never paste it into chat, a document, or a public repository.
4. In the BotFather chat, send `/setdescription` and `/setabouttext` to add a short description.
5. Send `/setcommands` and submit this command list:

   ```text
   start - Start the bot
   help - Show available commands
   faq - Browse frequently asked questions
   contact - Contact human support
   ```

## 2. Connect the bot to Make

1. Create a scenario in [Make](https://www.make.com/).
2. Add **Telegram Bot > Watch Updates** as the trigger.
3. Create a Telegram Bot connection and enter the token from BotFather in Make's credential dialog.
4. Run the trigger once, then send `/start` to your bot in Telegram. Confirm the trigger captures the update and its chat ID.
5. Add a **Router** after the trigger.

Use the incoming message's **Text** field for route filters and its **Chat ID** field as the recipient for replies. Add a Telegram **Send a Text Message or a Reply** module on each route, selecting the same bot connection.

## 3. Add the routes

Create four router routes. Configure each route's filter on the incoming message text, then map the trigger's Chat ID into the reply module's Chat ID field.

**Start route**

- Filter: Text equals `/start`.
- Reply: `Welcome to [Business Name] support. Use /faq for quick answers or /contact to reach our team.`

**Help route**

- Filter: Text equals `/help`.
- Reply: `Available commands: /faq for common questions, /contact for human support.`

**FAQ route**

- Filter: Text equals `/faq`.
- Reply: Replace this template with your real answers:

  ```text
  Frequently asked questions

  Hours: [support hours]
  Pricing: [pricing link or summary]
  Getting started: [instructions or link]
  Returns: [policy link or summary]

  Need more help? Use /contact.
  ```

**Contact route**

- Filter: Text equals `/contact`.
- Reply: `For personal support, message [@SupportUsername](https://t.me/SupportUsername). Our hours are [support hours].`
- Replace `SupportUsername` and the hours with your real details. Telegram message text may not render Markdown links unless parse mode is configured, so include the plain `https://t.me/YourSupportUsername` URL if needed.

**Fallback route**

- Configure this as the router's fallback route, not another exact-text route.
- Reply: `I didn't recognize that request. Use /faq for quick answers or /contact to reach our team.`

If your Make router does not offer a fallback toggle, add a final route filtered to messages that do not equal `/start`, `/help`, `/faq`, or `/contact`.

## 4. Test and publish

1. Use Make's **Run once** and test `/start`, `/help`, `/faq`, `/contact`, and an unrecognized message in a private chat with the bot.
2. Confirm every reply goes to the same chat that sent the command.
3. Fix any placeholder copy, support URL, and FAQ answers.
4. Turn the scenario on and set it to run immediately when the Telegram trigger receives an update.
5. Test again with the scenario on, then share the bot's `https://t.me/YourBotUsername` link.

## Notes

- Keep this bot dedicated to this Make scenario. A Telegram bot can have only one active webhook at a time; connecting it to another webhook-based service can interrupt updates here.
- Make's plan limits, module names, and free-tier allowances can change. Check the current plan before launch.
- Do not put passwords, payment details, or sensitive personal information in static FAQ replies. Use a secure support channel for private cases.
- This version is a FAQ bot with human handoff, not an AI chatbot, payment system, or custom Telegram Mini App.