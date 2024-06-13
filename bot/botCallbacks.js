const globals = require('../config/globals');
const { getUser } = require('../data/user');
const { updateUser } = require('../services/user');
const { resetInterval } = require('../utils/interval');

const registerCallbacks = (bot) => {
	bot.on('callback_query', async (callbackQuery) => {
		const chatId = callbackQuery.message.chat.id;
		const { interval, count, category, filterOption } = JSON.parse(callbackQuery.data);

		if (interval) {
			await updateUser(chatId.toString(), { timeInterval: interval });

			resetInterval(bot, chatId.toString(), interval);

			console.log(`INTERVAL: ${interval}`);
			bot.sendMessage(chatId, `Інтервал отримання встановлено - ${interval / 60} хвилин`);
		}

		if (count) {
			await updateUser(chatId.toString(), { numberJobs: count });
			console.log(`JOBS COUNT: ${count}`);
			bot.sendMessage(chatId, `Кількість отримання нових вакансій - ${count}`);
		}

		if (category) {
			await updateUser(chatId.toString(), { activeCategory: category });
			console.log(`CATEGORY: ${category}`);
			bot.sendMessage(chatId, `Нова категорія - ${category}`);
		}

		if (filterOption) {
			const { activeFilterOption } = await getUser({ chatId: chatId.toString() });

			if (activeFilterOption.includes(filterOption)) {
				const updatedFilter = activeFilterOption.filter((i) => i !== filterOption);
				await updateUser(chatId.toString(), { activeFilterOption: updatedFilter });
				bot.sendMessage(chatId, `Обрані фільтри: ${updatedFilter.join(', ')}`);
			} else {
				await updateUser(chatId.toString(), { activeFilterOption: [...activeFilterOption, filterOption] });
				bot.sendMessage(chatId, `Обрані фільтри: ${[...activeFilterOption, filterOption].join(', ')}`);
			}

			console.log(`FILTER OPTIONS UPDATED`);
		}
	});
};

module.exports = registerCallbacks;

