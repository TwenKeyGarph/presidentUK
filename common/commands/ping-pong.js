// consts
const i18n = require('i18n');

// export
module.exports = {
    name: 'ping-pong',
    aliases: ['ping'],
    example: 'ping',
    execute(client, message, args) {
        const locale = message.author.loc;

        message.reply(i18n.__mf(
            { phrase: 'ping-pong.pong', locale: locale },
            { ping: client.ws.ping }
        ));
    },
};