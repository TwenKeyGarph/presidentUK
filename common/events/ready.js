// consts

// export
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`${client.user.username} started.`);
	},
};