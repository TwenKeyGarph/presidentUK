// consts

// export
module.exports = {
    name: 'about-cmd',
    aliases: ['help','about'],
    about: 'Helping tool.',
    example: 'help [command]',
    execute(client, message, args) {
        let arg = args[0];
        if (client.CACHE.has(arg))
             message.reply(`${client.commands.get(client.CACHE.get(args[0])).aliases[0]} is ${client.commands.get(client.CACHE.get(args[0])).about}`)
        else 
            message.reply(`Wrong command (\`${arg}\`)`)
    },
};