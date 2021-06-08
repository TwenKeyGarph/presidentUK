// consts

// export
module.exports = {
    callout: 'ping',
    about: 'Awesome pong!',
    example: 'ping',
    execute(client, message, args) {
        message.reply('Pong!');
    },
};