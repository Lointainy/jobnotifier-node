const checkJobs = require('./jobScraper');
const sendJobNotification = require('./jobNotifier');
const globals = require('../config/globals');

const monitorJobs = async (bot) => {
	const jobs = await checkJobs(globals.activeCategory ? '' : globals.category[0], globals.filters, globals.jobsListLength);

	if (jobs.length > 0) {
		for (const job of jobs) {
			await sendJobNotification(bot, globals.chatID, job);
		}
	}
};

module.exports = monitorJobs;

