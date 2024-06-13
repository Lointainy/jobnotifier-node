const dotenv = require('dotenv');
const TelegramBot = require('node-telegram-bot-api');
const prisma = require('./prisma');

const connectDB = require('./config/connectDB');
const globals = require('./config/globals');
const registerCommands = require('./bot/botCommands');
const registerCallbacks = require('./bot/botCallbacks');

dotenv.config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const startServer = async () => {
	try {
		await connectDB();
		await prisma.$connect();

		console.log('Prisma connected successfully!');

		registerCommands(bot);
		registerCallbacks(bot);
	} catch (error) {
		console.error('Error starting server:', error);
		process.exit(1);
	}
};

startServer();
