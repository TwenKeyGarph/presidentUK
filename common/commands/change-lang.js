// consts
const mysql = require('mysql');

// export
module.exports = {
    name: 'change-lang',
    aliases: ['lang'],
    about: 'Changes your language!',
    example: 'lang en',
    execute(client, message, args) {
        message.reply('Pong!' + message.author.priv);
    },
};