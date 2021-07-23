// consts
const fs = require('fs');

// export
module.exports = {
    name: 'change-lang',
    aliases: ['lang', 'changelang', 'language'],
    example: 'lang <language>',
    execute(client, message, args) {
        const loc = message.author.loc

        if (!client.bot.users.preferences.get(message.author.id)) {
            client.connection.query(`INSERT INTO user_preferences (userID, language) VALUES (${message.author.id}, 'eng');`)
            client.bot.users.preferences.set(message.author.id, 'eng');
        }

        if (!args[0]) {
            message.reply(client.CACHE.loc[loc].change_lang.notEnoughArgs) //
        } else if (args[0] == 'list') {
            console.log(client.CACHE.loc.list);
            message.channel.send(client.CACHE.loc[loc].change_lang.langList + '\n' + client.CACHE.loc.list); //
        } else if (!client.CACHE.loc.list.includes(args[0].toLowerCase())) {
            message.channel.send(client.CACHE.loc[loc].change_lang.langNotFound + '`lang list`')
            return 1; // lang not found
        } else {
            client.connection.query(`UPDATE user_preferences SET language = '${args[0]}' WHERE userID=${message.author.id};`);
            client.bot.users.preferences.set(message.author.id, args[0]);
            console.log(args[0]);
            message.reply(client.CACHE.loc[args[0]].native + client.CACHE.loc[args[0]].change_lang.langSet)
        }
    },
};