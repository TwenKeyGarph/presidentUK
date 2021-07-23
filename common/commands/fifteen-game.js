// consts

// export
module.exports = {
    name: 'fifteen-game',
    aliases: ['ff','fifteen'],
    about: 'Awesome game!',
    example: 'ff [play | leaderboard]',
    async execute(client, message, args) {
        if (args[0] == 'play') {
            const promiseReturn = await require('./fifteen-game/play.js').out(client, message, args);
            if (promiseReturn) message.reply('Session already created.');
        } else if (args[0] == 'leaderboard') {
            require('./fifteen-game/leaderboard.js').out(client, message, args);
        } else {
        message.reply(client.getCmdByAlias('ff').example);
        }
    }
};