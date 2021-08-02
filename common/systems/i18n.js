// consts
const i18n = require('i18n');
const fs = require('fs');

// export
module.exports.out = function (client) {
	// loading user preferences
	client.connection.query(`SELECT userID, language FROM user_preferences;`, function (error, results, fields) {
		if (error) throw error;
		results.forEach(elem => {
			const JSONelem = JSON.parse(JSON.stringify(elem));
			client.bot.users.preferences.set(JSONelem.userID, JSONelem.language);
		});
	});

	let locales = fs.readdirSync('./common/locales').filter(file => file.endsWith('.json'));
	locales = locales.map(elem => {
		return elem.slice(0, elem.indexOf('.'))
	})

	i18n.configure({
		directory: "./common/locales",
		defaultLocale: "en",
		retryInDefaultLocale: true,
		objectNotation: true,
		register: global
	});
}