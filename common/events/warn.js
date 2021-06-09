// consts

// export
module.exports = {
	name: 'warn',
	once: false,
	execute(info, client) {
		console.log(info);
	},
};