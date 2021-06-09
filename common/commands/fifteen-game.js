// consts

// export
module.exports = {
    name: 'fifteen-game',
    aliases: ['ff','fifteen'],
    about: 'Awesome game!',
    example: 'ff play',
    execute(client, message, args) {
        if (args[0] == 'play')
            require('./fifteen-game/play.js').out(client, message, args);
        else
            message.reply(client.getCmdByAlias('ff').example);
    },
};