// consts
const fss = require('fs');

// export
exports.out = function (client, message, arg) {
    let JSONfile = require('./list.json');
    let msgRes = '';
    let placeNum = 0;
    JSONfile.array.sort((a, b) => a.won_moves > b.won_moves ? 1 : -1);
    JSONfile.array.forEach(async place => {
        let member = await message.guild.members.fetch(place.sessionID);
        console.log(member.user.username)
        msgRes = msgRes + `${++placeNum}. ${member.user.username} - ${place.won_moves} (${place.won_time}s.)\n`;
        if (placeNum == JSONfile.array.length && msgRes)
            message.channel.send(msgRes);
    });
}



/*
 * JSONfile.array.forEach(async place => {
            let member = await message.guild.members.fetch(place.sessionID);
            }
            */