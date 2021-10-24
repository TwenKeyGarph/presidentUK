// consts
const i18n = require('i18n');

// export // develping
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.CACHE.fifteen = [];
		client.CACHE.educate = [];
		client.bot = [];
		client.bot.users = [];
		client.bot.users.preferences = new Map;

		console.debug('EV_READY Loading i18n...')
		console.time('__sys_i18n')
		require('../systems/i18n.js').out(client);
		console.timeEnd('__sys_i18n')
		console.debug('EV_READY i18n loaded.')

		console.debug(`EV_READY Application ${client.user.username} are launched.`);
	},
};