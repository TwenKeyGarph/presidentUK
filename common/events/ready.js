// consts

// export // develping
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.CACHE.fifteen = [];
		client.bot = [];
		client.bot.users = [];
		client.bot.users.preferences = new Map;

		require('../system/localization.js').out(client); // localization system

		console.log(`Application ${client.user.username} are launched.`);
	},
};