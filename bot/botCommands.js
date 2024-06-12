const globals = require('../config/globals');
const monitorJobs = require('../services/jobMonitor');

let awaitingFilters = false;

const registerCommands = (bot) => {
	bot.onText(/\/start/, (msg) => {
		globals.chatID = msg.chat.id;
		bot.sendMessage(globals.chatID, 'Бот запущено!');
		console.log('Bot is RUN');
		globals.monitorJobsInterval = setInterval(() => monitorJobs(bot), globals.timeInterval * 1000);
	});

	bot.onText(/\/stop/, (msg) => {
		bot.sendMessage(msg.chat.id, 'Бот вимкнено!');
		console.log('Bot is STOP');
		clearInterval(globals.monitorJobsInterval);
		globals.monitorJobsInterval = null;
	});

	bot.onText(/\/filters/, (msg) => {
		const { id: chatId } = msg.chat;
		awaitingFilters = true;
		bot.sendMessage(chatId, 'Будь ласка, введіть фільтри через кому:\n приклад: javascipt,react');
	});

	bot.on('message', (msg) => {
		const { id: chatId } = msg.chat;

		if (awaitingFilters && msg.text !== '/filters') {
			globals.filters = msg.text.split(',').map((filter) => filter.trim());
			awaitingFilters = false;
			console.log(`FILTERS: ${globals.filters}`);
			bot.sendMessage(chatId, `Фільтри встановлено на ${globals.filters.join(', ')}`);
		}
	});

	bot.onText(/\/count/, (msg) => {
		const { id: chatId } = msg.chat;

		const count = {
			reply_markup: {
				inline_keyboard: [
					[{ text: '1', callback_data: JSON.stringify({ count: 1 }) }],
					[{ text: '3', callback_data: JSON.stringify({ count: 3 }) }],
					[{ text: '5', callback_data: JSON.stringify({ count: 5 }) }],
					[{ text: '10', callback_data: JSON.stringify({ count: 10 }) }]
				]
			}
		};

		bot.sendMessage(chatId, 'Кількість нових вакансій:', count);
	});

	bot.onText(/\/interval/, (msg) => {
		const { id: chatId } = msg.chat;

		const interval = {
			reply_markup: {
				inline_keyboard: [
					[{ text: '5 хвилин', callback_data: JSON.stringify({ interval: 5 * 60 }) }],
					[{ text: '15 хвилин', callback_data: JSON.stringify({ interval: 15 * 60 }) }],
					[{ text: '30 хвилин', callback_data: JSON.stringify({ interval: 30 * 60 }) }],
					[{ text: '1 годину', callback_data: JSON.stringify({ interval: 60 * 60 }) }]
				]
			}
		};

		bot.sendMessage(chatId, 'Отримувати повідомлення о вакансіях, раз на:', interval);
	});

	bot.onText(/\/category/, (msg) => {
		const { id: chatId } = msg.chat;

		const category = {
			reply_markup: {
				inline_keyboard: [
					[{ text: 'IT', callback_data: JSON.stringify({ category: 'it' }) }],
					[{ text: 'Дизайн', callback_data: JSON.stringify({ category: 'design-art' }) }]
				]
			}
		};

		bot.sendMessage(chatId, 'Отримувати повідомлення о вакансіях, раз на:', category);
	});

	bot.onText(/\/options/, (msg) => {
		const { id: chatId } = msg.chat;

		const filterOptions = {
			reply_markup: {
				inline_keyboard: [
					[{ text: 'Будь-яке з слів', callback_data: JSON.stringify({ filterOption: 'anyword' }) }],
					[{ text: 'Не тільки загаловки', callback_data: JSON.stringify({ filterOption: 'notitle' }) }]
				]
			}
		};

		bot.sendMessage(chatId, 'Виберіть фільтри:', filterOptions);
	});
};

module.exports = registerCommands;

