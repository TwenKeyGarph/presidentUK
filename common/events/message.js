// consts

// export
module.exports = {
    name: 'message',
    once: false,
    execute(message, client) {
        if (message.author.bot) return 1; // msg from bot
        if (!message.guild) return 2; // msg in DM
        if (!(message.content.startsWith(client.prefix))) return 3; // msg without prefix

        let cmdFull = message.content.slice(client.prefix.length);
        let cmdArgs = cmdFull.split(/ +/);
        let cmdCall = cmdArgs.shift().toLowerCase();

        if (!client.CACHE.alias.has(cmdCall)) return 4; // cmd not found
        const cmd = client.getCmdByAlias(cmdCall);

        try {
            cmd.execute(client, message, cmdArgs)
        } catch (err) {
            message.channel.send(`error caught \`${cmd.name}\`:\`${cmdCall}\`\n\`${err.message}\``);
            console.error(err);      
        }
    },
};
