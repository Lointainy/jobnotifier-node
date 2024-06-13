const defaultValue = {
	jobsListLength: [1, 3, 5, 10],
	msgInterval: [1, 5, 15, 30, 60],
	timeInterval: 60, // seconds
	category: [
		{
			tag: 'it',
			title: 'Айті'
		},
		{
			tag: 'design-art',
			title: 'Дизайн'
		}
	],
	filterOption: [
		{
			tag: 'anyword',
			title: 'Будь-яке з слів'
		},
		{
			tag: 'notitle',
			title: 'Не тільки загаловки'
		}
	],
	activeFilterOption: []
};

const userIntervals = new Map();

module.exports = {
	defaultValue,
	userIntervals
};
