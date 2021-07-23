// consts
const mysql = require('mysql');


// export
module.exports = {
    name: 'ping-pong',
    aliases: ['ping'],
    example: 'ping',
    execute(client, message, args) {
        message.reply(client.CACHE.loc[message.author.loc].ping_pong.pong);
    },
};