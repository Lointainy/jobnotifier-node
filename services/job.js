const db = require('../prisma');

const getJobs = async (userId) => {
	try {
		const jobs = await db.job.findMany({
			where: {
				userId
			}
		});

		return jobs;
	} catch (error) {
		console.error({ error: 'ErrorGetJobs', details: error });
		throw error;
	}
};

const createJob = async (data) => {
	try {
		const job = await db.job.create({
			data
		});

		return job;
	} catch (error) {
		console.error({ error: 'ErrorCreateJob', details: error });
		throw error;
	}
};

const deleteJob = async (id) => {
	try {
		const job = await db.job.delete({
			where: {
				id
			}
		});
	} catch (error) {
		console.error({ error: 'ErrorDeleteJob', details: error });
		throw error;
	}
};

module.exports = { getJobs, createJob, deleteJob };

