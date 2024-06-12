const sendJobNotification = async (bot, chatID, job) => {
	const message = `Нова вакансія: ${job.title}\nПосилання: ${job.url}`;
	const options = {
		disable_web_page_preview: true
	};
	await bot.sendMessage(chatID, message, options);
};

module.exports = sendJobNotification;
