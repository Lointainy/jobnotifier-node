const checkJobs = require('./jobScraper');
const sendJobNotification = require('./jobNotifier');
const globals = require('../config/globals');
const { getUser } = require('../data/user');
const { updateUser } = require('./user');
const { getJobs, createJob, deleteJob } = require('./job');

const monitorJobs = async (bot, chatId) => {
	const user = await getUser({ chatId });

	const jobs = await checkJobs(
		user.activeCategory == '' ? globals.defaultValue.category[0] : user.activeCategory,
		user.filters,
		user.activeFilterOption,
		user.numberJobs
	);

	const userJobs = await getJobs(user.id);
	console.log(userJobs.length);
	const newJobs = jobs.filter((job) => !userJobs.some((oldJob) => oldJob.url === job.url));
	console.log(newJobs.length);

	if (newJobs.length > 0) {
		for (const job of newJobs) {
			await createJob({ userId: user.id, ...job });
			await sendJobNotification(bot, user.chatId, job);
		}

		const updatedUserJobs = await getJobs(user.id);

		if (updatedUserJobs.length > user.numberJobs) {
			const jobsToDelete = updatedUserJobs.slice(0, updatedUserJobs.length - user.numberJobs);

			for (const job of jobsToDelete) {
				await deleteJob(job.id);
			}
		}
	}
};

module.exports = monitorJobs;
