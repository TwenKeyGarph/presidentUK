// consts

// export
module.exports = {
    name: 'fifteen-game',
    aliases: ['ff','fifteen'],
    example: 'ff [play | leaderboard]',
    async execute(client, message, args) {
        const loc = message.author.loc;
        if (args[0] == 'play') {
            const promiseReturn = await require('./fifteen-game/play.js').out(client, message, args);
            if (promiseReturn) message.reply(client.CACHE.loc[loc].fifteen_game.doubleSession + '`cancel`');
        } else if (args[0] == 'leaderboard') {
            require('./fifteen-game/leaderboard.js').out(client, message, args);
        } else {
            message.reply(client.CACHE.loc[loc].fifteen_game.cmdExample + client.getCmdByAlias('ff').example);
        }
    }
};