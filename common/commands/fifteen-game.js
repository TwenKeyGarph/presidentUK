// consts

// export
module.exports = {
    name: 'fifteen-game',
    aliases: ['ff','fifteen'],
    about: 'Awesome game!',
    example: 'ff play',
    async execute(client, message, args) {
        if(args[0] == 'play') {
            const promise = await require('./fifteen-game/play.js').out(client, message, args);
            if (promise) message.reply('Session already created.');
        } else if(args[0] == 'leaderboard') {
            require('./fifteen-game/leaderboard.js').out(client, message, args);
        } else {
            message.reply(client.getCmdByAlias('ff').example);
        }
    },
};