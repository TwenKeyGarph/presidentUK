// consts

// export // develping
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`${client.user.username} started.`);
		client.CACHE.fifteen = [];
		client.bot = [];
		client.bot.users = [];
		client.bot.users.preferences = new Map;
		client.CACHE.loc = [];

		require('../system/localization.js').out(client); // localization
	},
};