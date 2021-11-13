// consts
const i18n = require('i18n');
const fs = require('fs');
const path = require('path')

// export
module.exports.out = function (client) {
	// loading user preferences
	client.connection.query(`SELECT userID, language FROM user_preferences;`, function (error, results, fields) {
		// if (error) throw error;
		if (error) return;
		results.forEach(elem => {
			const JSONelem = JSON.parse(JSON.stringify(elem));
			client.bot.users.preferences.set(JSONelem.userID, JSONelem.language);
		});
	});

	let locales = fs.readdirSync('./common/locales').filter(file => file.endsWith('.json'));
	locales = locales.map(elem => {
		return path.extname(elem)
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
			console.debug('SYS_I18N dbg ' + msg)
		},

		// setting of log level WARN - default to require('debug')('i18n:warn')
		logWarnFn: function (msg) {
			console.debug('SYS_I18N wrn ' + msg)
		},

		// setting of log level ERROR - default to require('debug')('i18n:error')
		logErrorFn: function (msg) {
			console.debug('SYS_I18N err ' + msg)
		},

		// used to alter the behaviour of missing keys
		missingKeyFn: function (locale, value) {
			return value
		},
	});


	// require('debug')('i18n:debug')
}