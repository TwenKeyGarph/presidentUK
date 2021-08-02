// consts
const i18n = require('i18n');

// export // develping
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.CACHE.fifteen = [];
		client.bot = [];
		client.bot.users = [];
		client.bot.users.preferences = new Map;

		require('../systems/i18n.js').out(client);

		if (client.DEBUG) console.log(`EV_READY Application ${client.user.username} are launched.`);
	},
};