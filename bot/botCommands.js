const globals = require('../config/globals');
const { getUser } = require('../data/user');
const monitorJobs = require('../services/jobMonitor');
const { createUser, updateUser } = require('../services/user');
const { stopInterval, runInterval } = require('../utils/interval');

let awaitingUserFilters = new Map();

const isAuthenticated = async (bot, msg, next) => {
	const chatId = msg.chat.id.toString();

	const existingUser = await getUser({ chatId });

	if (!existingUser) {
		bot.sendMessage(Number(chatId), `Сталась помилка!\nБудь ласка введіть /start`);
		return null;
	}

	next();
};

const registerCommands = (bot) => {
	const withAuth = (handler) => async (msg) => {
		await isAuthenticated(bot, msg, () => handler(msg));
	};

	bot.onText(/\/start/, async (msg) => {
		const chatId = msg.chat.id.toString();

		const existingUser = await getUser({ chatId });

		if (!existingUser) {
			await createUser(chatId);
		}

		let userMonitorJobsInterval = globals.userIntervals.get(chatId);

		if (!userMonitorJobsInterval) {
			const intervalTime = existingUser ? existingUser.timeInterval : globals.defaultValue.timeInterval;

			runInterval(bot, chatId, intervalTime);

			await updateUser(chatId, { monitorJobsInterval: intervalTime });
		}

		console.log(`Bot is RUN for user ${chatId}`);

		bot.sendMessage(Number(chatId), 'Бот увімкнено!');
	});

	bot.onText(
		/\/stop/,
		withAuth(async (msg) => {
			const chatId = msg.chat.id.toString();

			const userMonitorJobsInterval = globals.userIntervals.get(chatId);

			if (userMonitorJobsInterval) {
				stopInterval(userMonitorJobsInterval, chatId);

				await updateUser(chatId, { monitorJobsInterval: null });

				console.log(`Bot is stopped for user ${chatId}`);

				bot.sendMessage(Number(chatId), 'Бот вимкнено!');
			} else {
				console.log(`Bot is not running for user ${chatId}`);
				bot.sendMessage(Number(chatId), 'Бот не був запущений.');
			}
		})
	);

	bot.onText(
		/\/filters/,
		withAuth(async (msg) => {
			const chatId = msg.chat.id.toString();

			awaitingUserFilters.set(chatId, true);

			bot.sendMessage(Number(chatId), 'Будь ласка, введіть фільтри через кому:\n приклад: javascipt,react');
		})
	);

	bot.on('message', async (msg) => {
		const chatId = msg.chat.id.toString();

		const awaitingFilters = awaitingUserFilters.get(chatId);

		if (awaitingFilters && msg.text !== '/filters') {
			const filters = msg.text.split(',').map((filter) => filter.trim());
			await updateUser(chatId, { filters });
			console.log(`FILTERS: ${filters}`);
			bot.sendMessage(Number(chatId), `Фільтри встановлено на ${filters.join(', ')}`);
		}
	});

	bot.onText(
		/\/count/,
		withAuth((msg) => {
			const { id: chatId } = msg.chat;

			let inlineKeyboardButton = globals.defaultValue.jobsListLength.map((count) => [
				{
					text: count.toString(),
					callback_data: JSON.stringify({ count: count })
				}
			]);

			const count = {
				reply_markup: {
					inline_keyboard: inlineKeyboardButton
				}
			};

			bot.sendMessage(chatId, 'Кількість нових вакансій:', count);
		})
	);

	bot.onText(
		/\/interval/,
		withAuth((msg) => {
			const { id: chatId } = msg.chat;

			let inlineKeyboardButton = globals.defaultValue.msgInterval.map((number) => [
				{
					text: `${number} хвилин`,
					callback_data: JSON.stringify({ interval: number * 60 })
				}
			]);

			const interval = {
				reply_markup: {
					inline_keyboard: inlineKeyboardButton
				}
			};

			bot.sendMessage(chatId, 'Отримувати повідомлення о вакансіях, раз на:', interval);
		})
	);

	bot.onText(
		/\/category/,
		withAuth((msg) => {
			const { id: chatId } = msg.chat;

			let inlineKeyboardButton = globals.defaultValue.category.map((i) => [
				{
					text: i.title,
					callback_data: JSON.stringify({ category: i.tag })
				}
			]);

			const category = {
				reply_markup: {
					inline_keyboard: inlineKeyboardButton
				}
			};

			bot.sendMessage(chatId, 'Отримувати повідомлення о вакансіях, раз на:', category);
		})
	);

	bot.onText(
		/\/options/,
		withAuth((msg) => {
			const { id: chatId } = msg.chat;

			let inlineKeyboardButton = globals.defaultValue.filterOption.map((i) => [
				{
					text: i.title,
					callback_data: JSON.stringify({ filterOption: i.tag })
				}
			]);

			const filterOptions = {
				reply_markup: {
					inline_keyboard: inlineKeyboardButton
				}
			};

			bot.sendMessage(chatId, 'Виберіть фільтри:', filterOptions);
		})
	);
};

module.exports = registerCommands;
