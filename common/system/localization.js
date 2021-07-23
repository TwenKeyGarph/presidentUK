// consts
const fs = require('fs');

// export
exports.out = function (client) {
    client.CACHE.loc = [];
    client.CACHE.loc.list = [];
    const sample = require(`../locales/eng.json`);

    // loading user preferences
    client.connection.query(`SELECT userID, language FROM user_preferences;`, function (error, results, fields) {
		if (error) throw error;
		results.forEach(elem => {
			const JSONelem = JSON.parse(JSON.stringify(elem));
			client.bot.users.preferences.set(JSONelem.userID, JSONelem.language);
		});
    });
    // init locales
    const locFiles = fs.readdirSync('./common/locales').filter(file => file.endsWith('.json'));
    // load locales
    for (const file of locFiles) {
        let loc = require(`../locales/${file}`);

        if (sample.length != loc.length) {
            console.log(`${file}:${loc.name} not identified. Is it outdated?`)
        } else {
            client.CACHE.loc[loc.code] = loc
            client.CACHE.loc.list.push(loc.code);
        }
    }
    console.log(`Localization system loaded. ${locFiles.length} locales are identified.`)
}