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
        
        message.author.loc = client.bot.users.preferences.get(message.author.id);
        if (!message.author.loc)
            message.author.loc = 'eng'; // default lang

        message.author.priv = client.CACHE.privileges.get(message.author.id)
        if (!message.author.priv)
            message.author.priv = 0;
        if (cmd.privileges && !cmd.privileges.includes(message.author.priv)) {
            message.reply(client.CACHE.loc[message.author.loc].message.accessDenied);
            return 5; // not enough permissions
        }


        try {
            cmd.execute(client, message, cmdArgs)
        } catch (err) {
            message.channel.send(`error caught \`${cmd.name}\`:\`${cmdCall}\`\n\`${err.message}\``);
            console.error(err);      
        }
    },
};
