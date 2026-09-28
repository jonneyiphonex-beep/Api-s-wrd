# API Workspace

This workspace contains two separate applications and one setup guide. The
web app explores Telegram's API methods. The Node.js app is a Telegram support
bot. Neither is a full Telegram client.

## Choose a project

| Path | What it is | How to start |
| --- | --- | --- |
| `/` | Offline Telegram MTProto API explorer | `python3 -m http.server 8000` |
| [`telegram-bot/`](telegram-bot/README.md) | Runnable Telegram Bot API support bot | Follow its setup guide |
| [`TELEGRAM_NO_CODE.md`](TELEGRAM_NO_CODE.md) | Alternative visual setup using Make | Follow the guide; no source code required |

Choose either the coded bot or the Make workflow for a bot. Do not connect the
same bot token to both at once.

## Web app

Run this command from the workspace root. Service workers require HTTP, so do
not open `index.html` directly as a file.

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Search the official MTProto methods by method
name, parameter, or return type. Select a method to view its ID, parameters,
and return type. The app shell and method catalog are cached for offline use.

### Refresh the Telegram method catalog

`telegram-methods.json` is generated from Telegram's official TL schema and
contains the client API methods (not Bot API methods). Refresh it from the
workspace root with:

```sh
node scripts/update-telegram-methods.mjs
```

## Telegram bot

The coded bot uses Node.js and the Telegram Bot API. See
[`telegram-bot/README.md`](telegram-bot/README.md) for BotFather setup,
environment variables, installation, and run instructions. Never commit the
bot token or put it in chat.

The [no-code guide](TELEGRAM_NO_CODE.md) describes a separate Make workflow.
The Bot API creates bots; Telegram API/TDLib is for custom Telegram clients and
requires a separate application.