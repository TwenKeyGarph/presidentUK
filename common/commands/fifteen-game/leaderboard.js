// consts
const fss = require('fs');

// export
exports.out = function (client, message, arg) {
    let JSONfile = require('./list.json');
    let leaderboardMessage = '';
    let index = 0;
    JSONfile.array.sort((a, b) => a.won_moves > b.won_moves ? 1 : -1); // sorting array of obj by moves
    JSONfile.array.forEach(async place => {
        let member = await message.guild.members.fetch(place.sessionID);
        leaderboardMessage += `${++index}. ${member.user.username} - ${place.won_moves} (${Math.round(place.won_time)} s)\n`;
        if (index == JSONfile.array.length && leaderboardMessage)
            message.channel.send(leaderboardMessage);
    });
}