// consts
const fss = require('fs');

// export
exports.out = function (client, message, arg) {
    client.connection.query(`SELECT * FROM fifteengame_leaderboard`, function (error, results, fields) {
        if (error) throw error;
        if (results[0]) {
            JSONresult = JSON.parse(JSON.stringify(results))
            JSONresult.sort((a, b) => a.wonMoves > b.wonMoves ? 1 : -1);
        } else {
            message.channel.send('Results not found.')
            return 1;
        }

        let leaderboardMessage = ''; let index = 0; let member; let num = 0;
        
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