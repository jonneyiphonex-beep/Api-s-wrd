import "dotenv/config";
import { Markup, Telegraf } from "telegraf";
import { FAQ_ANSWERS, FAQ_LABELS, getWelcomeMessage } from "./content.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is required. Copy .env.example to .env and add your BotFather token.");
}

const businessName = process.env.BUSINESS_NAME?.trim() || "Our Business";
const supportUsername = process.env.SUPPORT_USERNAME?.trim().replace(/^@/, "");
const bot = new Telegraf(token);

function homeKeyboard() {
  const buttons = [[Markup.button.callback("Browse FAQs", "faq:menu")]];
  if (supportUsername) {
    buttons.push([Markup.button.url("Contact support", `https://t.me/${supportUsername}`)]);
  } else {
    buttons.push([Markup.button.callback("Contact support", "contact:show")]);
  }
  return Markup.inlineKeyboard(buttons);
}

function faqKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback(FAQ_LABELS.hours, "faq:hours")],
    [Markup.button.callback(FAQ_LABELS.pricing, "faq:pricing")],
    [Markup.button.callback(FAQ_LABELS.orders, "faq:orders")],
    [Markup.button.callback("Back", "menu:home")],
  ]);
}

function contactMessage() {
  if (supportUsername) return `Contact our team at @${supportUsername}.`;
  return "Contact support is not configured yet. Set SUPPORT_USERNAME in your .env file.";
}

async function showHome(ctx, edit = false) {
  const message = getWelcomeMessage(businessName);
  if (edit && ctx.callbackQuery?.message) {
    return ctx.editMessageText(message, homeKeyboard());
  }
  return ctx.reply(message, homeKeyboard());
}

bot.start((ctx) => showHome(ctx));
bot.help((ctx) => showHome(ctx));
bot.command("faq", (ctx) => ctx.reply("Choose a frequently asked question:", faqKeyboard()));
bot.command("contact", (ctx) => ctx.reply(contactMessage(), homeKeyboard()));

bot.action("faq:menu", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText("Choose a frequently asked question:", faqKeyboard());
});

bot.action(/^faq:(hours|pricing|orders)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const topic = ctx.match[1];
  await ctx.editMessageText(`${FAQ_LABELS[topic]}\n\n${FAQ_ANSWERS[topic]}`, faqKeyboard());
});

bot.action("menu:home", async (ctx) => {
  await ctx.answerCbQuery();
  await showHome(ctx, true);
});

bot.action("contact:show", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(contactMessage(), homeKeyboard());
});

bot.on("text", (ctx) => ctx.reply("I didn't recognize that message. Use /faq for common questions or /contact to reach our team."));

bot.catch((error) => {
  console.error("Telegram update failed:", error.message);
});

bot.telegram.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Show available options" },
  { command: "faq", description: "Browse common questions" },
  { command: "contact", description: "Contact human support" },
]).then(() => bot.launch()).then(() => {
  console.log("Telegram support bot is running.");
}).catch((error) => {
  console.error("Could not start the Telegram bot:", error.message);
  process.exitCode = 1;
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));