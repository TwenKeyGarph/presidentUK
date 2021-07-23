// consts
const mysql = require('mysql');

// export
module.exports = {
    name: 'ping-pong',
    aliases: ['ping'],
    about: 'Awesome pong!',
    example: 'ping',
    execute(client, message, args) {
        message.reply('Pong!' + message.author.priv);
    },
};