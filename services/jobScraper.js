// services/jobScraper.js
const axios = require('axios');
const cheerio = require('cheerio');

const checkJobs = async (category, filters, jobsListLength) => {
	try {
		const url = `https://www.work.ua/jobs-${category}-${filters.join('+')}/?advs=1&anyword=1&notitle=1`;
		console.log(`URL: ${url}`);

		const { data } = await axios.get(url);
		const $ = cheerio.load(data);
		let jobs = [];

		$('#pjax-jobs-list .card')
			.slice(0, jobsListLength)
			.each((i, e) => {
				const title = $(e).find('h2 a').text().trim();
				const url = `https://www.work.ua/${$(e).find('h2 a').attr('href')}`;
				const desc = $(e).find('p').text().trim();
				jobs.push({ title, url, desc });
			});

		return jobs;
	} catch (error) {
		console.error(error);
		return [];
	}
};

module.exports = checkJobs;

