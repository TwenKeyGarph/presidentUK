// consts
const i18n = require('i18n');

// export
module.exports = {
    name: 'fifteen-game',
    aliases: ['ff','fifteen'],
    example: 'ff [play | leaderboard]',
    async execute(client, message, args) {
        const locale = message.author.loc;
        if (args[0] == 'play') {
            const promiseReturn = await require('./fifteen-game/play.js').out(client, message, args);
            if (promiseReturn) message.reply(i18n.__mf(
                { phrase: 'fifteen-game.doubleSession', locale: locale },
                { cmd: 'cancel'}));
        } else if (args[0] == 'leaderboard') {
            require('./fifteen-game/leaderboard.js').out(client, message, args);
        } else {
            message.reply(i18n.__mf(
                { phrase: 'fifteen-game.cmdExample', locale: locale },
                { example: client.getCmdByAlias('ff').example }
            ));
        }
    }
};