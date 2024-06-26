const globals = require('../config/globals');
const db = require('../prisma');

const getUser = async (identifier) => {
	try {
		const user = await db.user.findUnique({
			where: identifier
		});

		return user;
	} catch {
		return null;
	}
};

const createUser = async (chatId) => {
	try {
		const user = await db.user.create({
			data: {
				chatId,
				activeCategory: globals.defaultValue.category[0].tag
			}
		});

		return user;
	} catch (error) {
		console.error({ error: 'ErrorCreateUser', details: error });
	}
};

const updateUser = async (chatId, data) => {
	try {
		const user = await db.user.update({
			where: {
				chatId
			},
			data
		});

		return user;
	} catch (error) {
		console.error({ error: 'ErrorUpdateUser', details: error });
	}
};

module.exports = { createUser, updateUser, getUser };
