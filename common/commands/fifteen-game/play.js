// consts

// export
exports.out = async function (client, message, arg) {
    const sessionID = message.author.id;
    FF = require('./class.js');
    if (client.CACHE.ff.indexOf(sessionID) != -1)
        return 1;
    client.CACHE.ff.push(sessionID);
    message.channel.send(`Session initialized by ${message.author.username}`);

    console.log(Fifteen);
    message.reply('do');


    client.CACHE.ff.splice(client.CACHE.ff.indexOf(sessionID));
}
