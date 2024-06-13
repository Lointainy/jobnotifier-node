const globals = require('../config/globals');
const monitorJobs = require('../services/jobMonitor');

function resetInterval(bot, chatId, interval) {
	let userMonitorJobsInterval = globals.userIntervals.get(chatId);

	if (userMonitorJobsInterval) {
		clearInterval(userMonitorJobsInterval);
		globals.userIntervals.delete(chatId);
		runInterval(bot, chatId, interval);
	}
}

function runInterval(bot, chatId, interval) {
	let userMonitorJobsInterval = setInterval(() => monitorJobs(bot, chatId), interval * 1000);
	globals.userIntervals.set(chatId, userMonitorJobsInterval);
}

function stopInterval(userMonitorJobsInterval, chatId) {
	clearInterval(userMonitorJobsInterval);
	globals.userIntervals.delete(chatId);
}

module.exports = { resetInterval, runInterval, stopInterval };

