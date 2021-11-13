// consts
const fss = require('fs');
const i18n = require('i18n');

// export
exports.out = function (client, message, arg) {
    const locale = message.author.loc;

    console.debug('\tloading leaderboard..')
    client.connection.query(`SELECT * FROM fifteengame_leaderboard`, function (error, results, fields) {
        // if (error) throw error;
        if (error || !results) {
            console.debug(`\tloading error.`)
            message.channel.send(`error caught \`fifteen-game\`:\`ff}\`\n\`${error.message}\``);
            console.debug(`EV_MESSAGE fifteen-game:ff - ${error.message}`);
            return;
        }
        if (results[0]) {
            console.debug(`\tloaded.`);
            JSONresult = JSON.parse(JSON.stringify(results))
            JSONresult.sort((a, b) => a.wonMoves > b.wonMoves ? 1 : -1);
        } else {
            message.channel.send(i18n.__(
                { phrase: 'fifteen-game.topEmpty', locale: locale }));
            console.debug('\tloaded: empty');
            return 1;
        }

        let leaderboardMessage = i18n.__({ phrase: 'fifteen-game.topBoard', locale: locale }) + '\n';
        let index = 0; let member; let num = 0;

        JSONresult.forEach(async place => {
            try {
                member = await message.guild.members.fetch(place.sessionID); index++;
                leaderboardMessage += `${++num}. ${member.user.username} - ${place.wonMoves} (${Math.round(place.wonTime)} s)\n`;
            } catch {
                index++;
            }
            if (index == JSONresult.length && leaderboardMessage)
                message.channel.send(leaderboardMessage);
        });
    });
}