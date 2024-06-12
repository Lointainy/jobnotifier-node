const globals = require('../config/globals');
const monitorJobs = require('../services/jobMonitor');

const registerCallbacks = (bot) => {
	bot.on('callback_query', (callbackQuery) => {
		const chatId = callbackQuery.message.chat.id;
		const { interval, count, category, filterOption } = JSON.parse(callbackQuery.data);

		if (interval) {
			globals.timeInterval = interval;
			console.log(`INTERVAL: ${globals.timeInterval}`);
			bot.sendMessage(chatId, `Інтервал отримання встановлено - ${interval / 60} хвилин`);
			updateInterval(bot);
		}

		if (count) {
			globals.jobsListLength = count;
			console.log(`JOBS COUNT: ${globals.jobsListLength}`);
			bot.sendMessage(chatId, `Кількість отримання нових вакансій - ${count}`);
		}

		if (category) {
			globals.activeCategory = category;
			console.log(`CATEGORY: ${globals.activeCategory}`);
			bot.sendMessage(chatId, `Нова категорія - ${category}`);
			updateInterval(bot);
		}

		if (filterOption) {
			if (!globals.activeFilterOption.includes(filterOption)) {
				globals.activeFilterOption.push(filterOption);
			} else {
				const index = globals.activeFilterOption.indexOf(filterOption);
				if (index > -1) {
					globals.activeFilterOption.splice(index, 1);
				}
			}

			console.log(`FILTER OPTIONS: ${globals.activeFilterOption}`);
			bot.sendMessage(chatId, `Обрані фільтри: ${globals.activeFilterOption.join(', ')}`);
		}
	});
};

function updateInterval(bot) {
	clearInterval(globals.monitorJobsInterval);
	console.log('UPDATE INTERVAL');
	globals.monitorJobsInterval = setInterval(() => monitorJobs(bot), globals.timeInterval * 1000);
}

module.exports = registerCallbacks;
