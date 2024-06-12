const dotenv = require('dotenv');
const TelegramBot = require('node-telegram-bot-api');
const globals = require('./config/globals');
const registerCommands = require('./bot/botCommands');
const registerCallbacks = require('./bot/botCallbacks');

dotenv.config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

registerCommands(bot);
registerCallbacks(bot);
