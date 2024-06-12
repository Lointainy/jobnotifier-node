const globals = require('../config/globals');
const monitorJobs = require('../services/jobMonitor');

const registerCallbacks = (bot) => {
	bot.on('callback_query', (callbackQuery) => {
		const chatId = callbackQuery.message.chat.id;
		const { interval, count } = JSON.parse(callbackQuery.data);
		if (interval) {
			globals.timeInterval = interval;
			console.log(`INTERVAL: ${globals.timeInterval}`);
			bot.sendMessage(chatId, `Інтервал отримання встановлено: ${interval / 60} хвилин`);

			if (globals.monitorJobsInterval) {
				clearInterval(globals.monitorJobsInterval);
			}

			globals.monitorJobsInterval = setInterval(() => monitorJobs(bot), globals.timeInterval * 1000);
		}
		if (count) {
			globals.jobsListLength = count;
			console.log(`JOBS COUNT: ${globals.jobsListLength}`);
			bot.sendMessage(chatId, `Кількість отримання нових вакансій ${count}`);
		}
	});
};

module.exports = registerCallbacks;
