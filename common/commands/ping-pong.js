// consts
const mysql = require('mysql');


// export
module.exports = {
    name: 'ping-pong',
    aliases: ['ping'],
    example: 'ping',
    execute(client, message, args) {
        const loc = message.author.loc;
        message.reply(client.CACHE.loc[loc].ping_pong.pong);
    },
};