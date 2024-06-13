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

module.exports = { getUser };

