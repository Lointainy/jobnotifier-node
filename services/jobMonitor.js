const checkJobs = require('./jobScraper');
const sendJobNotification = require('./jobNotifier');
const globals = require('../config/globals');

const monitorJobs = async (bot) => {
	const jobs = await checkJobs(
		globals.activeCategory == '' ? globals.category[0] : globals.activeCategory,
		globals.filters,
		globals.activeFilterOption,
		globals.jobsListLength
	);

	const newJobs = jobs.filter((job) => !globals.jobsList.some((oldJob) => oldJob.url === job.url));

	if (newJobs.length > 0) {
		for (const job of newJobs) {
			await sendJobNotification(bot, globals.chatID, job);
		}

		globals.jobsList = [...newJobs, ...globals.jobsList].slice(0, globals.jobsListLength);
	}
};

module.exports = monitorJobs;

