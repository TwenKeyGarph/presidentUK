// consts
const fs = require('fs');

// export
exports.out = function (client) {
    client.connection.query(`SELECT userID, language FROM user_preferences;`, function (error, results, fields) {
			if (error) throw error;
			results.forEach(elem => {
				const JSONelem = JSON.parse(JSON.stringify(elem));
				console.log(JSONelem);
				client.bot.users.preferences.set(JSONelem.userID, JSONelem.language);
			});
		});
    return 0;
}