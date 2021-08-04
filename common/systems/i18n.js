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
		register: global,
		autoReload: true,

		// whether to write new locale information to disk - defaults to true
		updateFiles: false,

		// sync locale information across all files - defaults to false
		syncFiles: false,
		logDebugFn: function (msg) {
			console.log('debug', msg)
		},

		// setting of log level WARN - default to require('debug')('i18n:warn')
		logWarnFn: function (msg) {
			console.log('warn', msg)
		},

		// setting of log level ERROR - default to require('debug')('i18n:error')
		logErrorFn: function (msg) {
			console.log('error', msg)
		},

		// used to alter the behaviour of missing keys
		missingKeyFn: function (locale, value) {
			return value
		},
	});


	require('debug')('i18n:debug')
}