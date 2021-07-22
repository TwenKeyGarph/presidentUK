// consts
const fss = require('fs');

// export
exports.out = function (client, message, arg) {
    client.connection.query(`SELECT * FROM fifteengame_leaderboard`, function (error, results, fields) {
        if (error) throw error;
        if (results[0]) {
            JSONresult = JSON.parse(JSON.stringify(results))
            console.log(JSONresult);
            JSONresult.sort((a, b) => a.wonMoves > b.wonMoves ? 1 : -1);
            console.log(JSONresult)
        } else {
            message.channel.send('Results not found.')
            return 1;
        }

        let leaderboardMessage = '';
        let index = 0;

        JSONresult.forEach(async place => {
            let member = await message.guild.members.fetch(place.sessionID);
            leaderboardMessage += `${++index}. ${member.user.username} - ${place.wonMoves} (${Math.round(place.wonTime)} s)\n`;
            if (index == JSONresult.length && leaderboardMessage)
                message.channel.send(leaderboardMessage);
        });
    });
}