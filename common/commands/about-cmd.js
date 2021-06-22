// consts

// export
module.exports = {
    name: 'about-cmd',
    aliases: ['help','about'],
    about: 'Helping tool.',
    example: 'help [command]',
    execute(client, message, args) {
        let arg = args[0];
        if (client.CACHE.alias.has(arg))
            message.reply(`${client.getCmdByAlias(arg).aliases[0]} is ${client.getCmdByAlias(arg).about}`)
        else 
            message.reply(`Wrong command (\`${arg}\`)`)
    },
};