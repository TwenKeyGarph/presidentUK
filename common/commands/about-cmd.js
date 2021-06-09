// consts

// export
module.exports = {
    sysname: 'about-cmd',
    callout: 'help',
    about: 'Helping tool.',
    example: 'help [command]',
    execute(client, message, args) {
        if (args) {
            message.reply(`${client.commands.get(args[0]).about}`);
        } else {
            message.reply(`${client.commands.get('help').example}`);
        }
    },
};