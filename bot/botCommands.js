const globals = require('../config/globals');
const { getUser, createUser, updateUser } = require('../data/user');
const monitorJobs = require('../services/jobMonitor');
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

			const { filters: oldFilters } = await getUser({ chatId });

			awaitingUserFilters.set(chatId, true);

			bot.sendMessage(
				Number(chatId),
				`Старі фільтри: ${oldFilters.join(', ')}. \n\n Будь ласка, введіть фільтри через кому:\n приклад: javascipt,react
				\n\n Якщо не плануєте змінювати фільтри то напишість 'no'`
			);
		})
	);

	bot.on('message', async (msg) => {
		const chatId = msg.chat.id.toString();

		const awaitingFilters = awaitingUserFilters.get(chatId);

		if (msg.text.toLowerCase() === 'no') {
			awaitingUserFilters.delete(chatId);
		}

		if (awaitingFilters && msg.text !== '/filters' && msg.text.toLowerCase() !== 'no') {
			const filters = msg.text.split(',').map((filter) => filter.trim());

			await updateUser(chatId, { filters });

			awaitingUserFilters.delete(chatId);

			console.log(`FILTERS: ${filters}`);

			bot.sendMessage(Number(chatId), `Фільтри встановлено на ${filters.join(', ')}`);
		}
	});

	bot.onText(
		/\/count/,
		withAuth(async (msg) => {
			const { id: chatId } = msg.chat;

			const { numberJobs } = await getUser({ chatId: chatId.toString() });

			let inlineKeyboardButton = globals.defaultValue.jobsListLength.map((i) => {
				const isActive = i === Number(numberJobs);
				const text = isActive ? `✅ ${i}` : i;

				return [
					{
						text,
						callback_data: JSON.stringify({ count: i })
					}
				];
			});

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
		withAuth(async (msg) => {
			const { id: chatId } = msg.chat;

			const { timeInterval } = await getUser({ chatId: chatId.toString() });

			let inlineKeyboardButton = globals.defaultValue.msgInterval.map((i) => {
				const isActive = i === timeInterval / 60;
				const text = isActive ? `✅ ${i} хв.` : i;

				return [
					{
						text,
						callback_data: JSON.stringify({ interval: i * 60 })
					}
				];
			});

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
		withAuth(async (msg) => {
			const { id: chatId } = msg.chat;

			const { activeCategory } = await getUser({ chatId: chatId.toString() });

			let inlineKeyboardButton = globals.defaultValue.category.map((i) => {
				const isActive = i.tag === activeCategory;
				const text = isActive ? `✅ ${i.title}` : i.title;

				return [
					{
						text,
						callback_data: JSON.stringify({ category: i.tag })
					}
				];
			});

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
		withAuth(async (msg) => {
			const { id: chatId } = msg.chat;

			const { activeFilterOption } = await getUser({ chatId: chatId.toString() });

			let inlineKeyboardButton = globals.defaultValue.filterOption.map((i) => {
				const isActive = activeFilterOption.includes(i.tag);
				const text = isActive ? `✅ ${i.title}` : i.title;

				return [
					{
						text,
						callback_data: JSON.stringify({ filterOption: i.tag })
					}
				];
			});

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
