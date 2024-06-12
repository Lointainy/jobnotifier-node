const globals = require('../config/globals');
const monitorJobs = require('../services/jobMonitor');

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
	});

	bot.onText(/\/filters (.+)/, (msg, match) => {
		const { id: chatId } = msg.chat;
		globals.filters = match[1].split(',');
		console.log(`FILTERS: ${globals.filters}`);
		bot.sendMessage(chatId, `Фільтри встановлено на ${globals.filters.join(', ')}`);
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
					[{ text: '5 хвилин', callback_data: JSON.stringify({ interval: 1 * 10 }) }],
					[{ text: '15 хвилин', callback_data: JSON.stringify({ interval: 15 * 60 }) }],
					[{ text: '30 хвилин', callback_data: JSON.stringify({ interval: 30 * 60 }) }],
					[{ text: '1 годину', callback_data: JSON.stringify({ interval: 60 * 60 }) }]
				]
			}
		};

		bot.sendMessage(chatId, 'Отримувати повідомлення о вакансіях, раз на:', interval);
	});
};

module.exports = registerCommands;

