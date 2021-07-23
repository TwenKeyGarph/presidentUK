// consts

// export
module.exports = {
    name: 'about-cmd',
    aliases: ['help','about'],
    example: 'help [cmd]',
    execute(client, message, args) {
        let arg = args[0];
        const loc = message.author.loc;
        let cmd, c;
        // ACHTUNG!!! ATTENTION!!! Continue at your own risk.
        if (client.CACHE.alias.has(arg)) {
            cmd = client.getCmdByAlias(arg).name
            c = cmd; let i = c.indexOf('-');
            c = c.substring(0, i) + '_' + c.substring(i + 1);
            message.reply(client.getCmdByAlias(arg).aliases[0] + ': ' + client.CACHE.loc[loc][c].about);
        } else {
            if (!arg) arg = '';
            message.reply(client.CACHE.loc[loc].about_cmd.wrongArg + `(\`${arg}\`)`)
        }
    },
};