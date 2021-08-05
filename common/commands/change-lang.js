// consts
const fs = require('fs');
const Discord = require('discord.js'); 
const { MessageButton, MessageActionRow } = require('discord-buttons');
const i18n = require('i18n');

// export
module.exports = {
    name: 'change-lang',
    aliases: ['lang', 'changelang', 'language'],
    example: 'lang <language>',
    async execute(client, message, args) {
        let locale = message.author.loc;

        if (!args[0]) {
            console.debug(`CMD_CHANGE-LANG !args`)
            let embed = new Object;
            embed.en = new Discord.MessageEmbed()
                .setTitle("Locale-system.")
                .setDescription("Choose your destiny")
                .setColor('#36A4CF')
                .setImage("https://media.discordapp.net/attachments/689554001724833822/868953984394735666/kk.english.png?width=906&height=499")
                .addField(":flag_gb: __English__", "tia cantry", true)
                .addField(":flag_ru: Russian", "suqa blet", true);

            embed.ru = new Discord.MessageEmbed()
                .setTitle("Locale-system.")
                .setDescription("Выбери своего бойца")
                .setColor('#CE9A14')
                .setImage("https://media.discordapp.net/attachments/689554001724833822/868953973741223986/kk.russia.png?width=906&height=499")
                .addField(":flag_gb: English", "пендосы", true)
                .addField(":flag_ru: __Russian__", "роисся", true);


            let button = new Object;
            button.left = new MessageButton()
                .setStyle('blurple')
                .setLabel('❮')
                .setID('button_left');

            button.right = new MessageButton()
                .setStyle('blurple')
                .setLabel('❯')
                .setID('button_right');

            button.select = new MessageButton()
                .setStyle('gray')
                .setLabel('▣')
                .setID('button_select');


            let buttons = new MessageActionRow()
                .addComponents(button.left, button.right, button.select);
            
            let msgPromise = await message.channel.send(embed[locale], buttons);

            const ButtonCollector = msgPromise.createButtonCollector((button) => button.clicker.user.id === message.author.id, { time: 15000 });

            ButtonCollector.on('collect', (b) => {
                b.reply.defer();
                if (b.id == 'button_left') {
                    msgPromise.edit(embed.en, buttons);
                    locale = 'en';
                    console.debug(`CMD_CHANGE-LANG ${b.id} ${locale}`)
                } else if (b.id == 'button_right') {
                    msgPromise.edit(embed.ru, buttons);
                    locale = 'ru';
                    console.debug(`CMD_CHANGE-LANG ${b.id} ${locale}`)
                } else if (b.id == 'button_select') {
                    console.debug(`CMD_CHANGE-LANG ${b.id} ${locale}`)
                    ButtonCollector.stop('cancel')
                };
                ButtonCollector.resetTimer();
            });

            ButtonCollector.on('end', (collected, reason) => {
                let nativeLang = i18n.__({ phrase: 'meta.native', locale: locale} )
                let desc = i18n.__mf(
                    { phrase: 'change-lang.langSet', locale: locale },
                    { newlang: nativeLang});
                embed.end = new Discord.MessageEmbed()
                    .setTitle("Locale-system.")
                    .setDescription(desc);
                if (!client.bot.users.preferences.get(message.author.id) == locale) {
                    client.connection.query(`UPDATE user_preferences SET language = '${locale}' WHERE userID=${message.author.id};`);
                    console.debug(`CMD_CHANGE-LANG prefs set ${message.author.id} - ${locale}`);
                    client.bot.users.preferences.set(message.author.id, locale);
                }
                msgPromise.edit(embed.end);
                setTimeout(function () {
                    msgPromise.delete();
                    message.delete();
                }, 2000)
            });
        } else if (args[0] == 'list') {
            console.debug(`CMD_CHANGE-LANG arg list`);
            message.channel.send(i18n.__mf(
                { phrase: 'change-lang.langList', locale: locale }) + '\n' + i18n.getLocales().join(' '));
        } else if (i18n.getLocales().includes(args[0].toLowerCase())) {
            console.debug(`CMD_CHANGE-LANG arg lang`)
            client.connection.query(`UPDATE user_preferences SET language = '${args[0]}' WHERE userID=${message.author.id};`);
            console.debug(`CMD_CHANGE-LANG prefs set ${message.author.id} - ${locale}`);
            client.bot.users.preferences.set(message.author.id, args[0]);
            locale = args[0];
            message.reply(i18n.__mf(
                { phrase: 'change-lang.langSet', locale: locale },
                { newlang: i18n.__({ phrase: 'meta.native', locale: locale }) }));
        } else {
            message.channel.send(i18n.__(
                { phrase: 'change-lang.langNotFound', locale: locale }) + '`lang list`')
            return 1; // lang not found
        }
    },
};

