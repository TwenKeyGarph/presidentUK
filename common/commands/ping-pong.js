// consts

// export
module.exports = {
    sysname: 'ping-pong',
    callout: 'ping',
    about: 'Awesome pong!',
    example: 'ping',
    execute(client, message, args) {
        message.reply('Pong!');
    },
};