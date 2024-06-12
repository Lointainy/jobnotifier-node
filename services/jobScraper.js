const axios = require('axios');
const cheerio = require('cheerio');

const checkJobs = async (category, filters, filterOption, jobsListLength) => {
	try {
		const option = filterOption.map((param) => `${param}=1`).join('&');
		const url = `https://www.work.ua/jobs-${category}-${filters.join('+')}/?advs=1&${option}`;
		console.log(`URL: ${url}`);

		const { data } = await axios.get(url);
		const $ = cheerio.load(data);
		let jobs = [];

		$('#pjax-jobs-list .card')
			.slice(0, jobsListLength)
			.each((i, e) => {
				const title = $(e).find('h2 a').text().trim();
				const url = `https://www.work.ua${$(e).find('h2 a').attr('href')}`;
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

