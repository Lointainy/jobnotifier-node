const dotenv = require('dotenv');
const axios = require('axios');
const cheerio = require('cheerio');
const TelegramBot = require('node-telegram-bot-api');

dotenv.config();

const token = process.env.BOT_TOKEN;

//GLOBALS

let chatID;
let monitorJobsInterval;
let filters = [];
let jobsListLength = 1;
let timeInterval = 60; // seconds
let category = ['it'];

const bot = new TelegramBot(token, { polling: true });

async function sendJobNotification(job) {
	const message = `Нова вакансія: ${job.title}\nПосилання: ${job.url}`;
	const options = {
		disable_web_page_preview: true
	};
	await bot.sendMessage(chatID, message, options);
}

async function checkJobs() {
	try {
		console.log(`URL: https://www.work.ua/jobs-${category[0]}-${filters.join('+')}/?advs=1&anyword=1&notitle=1`);

		const { data } = await axios.get(`https://www.work.ua/jobs-it-${filters.join('+')}/?advs=1&anyword=1&notitle=1`);
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
}

async function monitorJobs() {
	const jobs = await checkJobs();

	if (jobs.length > 0) {
		for (const job of jobs) {
			await sendJobNotification(job);
		}
	}
}

bot.onText(/\/start/, (msg) => {
	chatID = msg.chat.id;
	bot.sendMessage(chatID, 'Бот запущено!');
	console.log('Bot is RUN');
	monitorJobsInterval = setInterval(monitorJobs, timeInterval * 1000);
});

bot.onText(/\/stop/, (msg) => {
	bot.sendMessage(msg.chat.id, 'Бот вимкнено!');
	console.log('Bot is STOP');
	clearInterval(monitorJobsInterval);
});

bot.onText(/\/filters (.+)/, (msg, match) => {
	const { id: chatId } = msg.chat;
	filters = match[1].split(',');
	console.log(`FILTERS: ${filters}`);
	bot.sendMessage(chatId, `Фільтри встановлено на ${filters.join(', ')}`);
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

bot.on('callback_query', (callbackQuery) => {
	const chatId = callbackQuery.message.chat.id;
	const { interval, count } = JSON.parse(callbackQuery.data);
	if (interval) {
		timeInterval = interval;
		console.log(`INTERVAL: ${timeInterval}`);
		bot.sendMessage(chatId, `Інтервал отримання встановлено: ${interval / 60} хвилин`);

		if (monitorJobsInterval) {
			clearInterval(monitorJobsInterval);
		}

		monitorJobsInterval = setInterval(monitorJobs, timeInterval * 1000);
	}
	if (count) {
		jobsListLength = count;
		console.log(`JOBS COUNT: ${jobsListLength}`);
		bot.sendMessage(chatId, `Кількість отримання нових вакансій ${count}`);
	}
});
