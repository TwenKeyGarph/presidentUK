// consts
const fs = require('fs');
const Discord = require('discord.js'); 
const { MessageButton, MessageActionRow } = require('discord-buttons');



// export
module.exports = {
    name: 'change-lang',
    aliases: ['lang', 'changelang', 'language'],
    example: 'lang <language>',
    async execute(client, message, args) {
        const loc = message.author.loc;

        if (!args[0]) {
            // message.reply(client.CACHE.loc[loc].change_lang.notEnoughArgs)


            let embedENG = new Discord.MessageEmbed()
                .setTitle("Locale-system.")
                .setDescription("Choose your destiny")
                .setColor('#36A4CF')
                .setImage("https://media.discordapp.net/attachments/689554001724833822/868953984394735666/kk.english.png?width=906&height=499")
                .addField(":flag_gb: __English__", "tia cantry", true)
                .addField(":flag_ru: Russian", "suqa blet", true);

            let embedRUS = new Discord.MessageEmbed()
                .setTitle("Locale-system.")
                .setDescription("Выбери своего бойца")
                .setColor('#CE9A14')
                .setImage("https://media.discordapp.net/attachments/689554001724833822/868953973741223986/kk.russia.png?width=906&height=499")
                .addField(":flag_gb: English", "пендосы", true)
                .addField(":flag_ru: __Russian__", "роисся", true);


            let buttonLEFT = new MessageButton()
                .setStyle('blurple')
                .setLabel('❮')
                .setID('button_left');

            let buttonRIGHT = new MessageButton()
                .setStyle('blurple')
                .setLabel('❯')
                .setID('button_right');

            let buttonSELECT = new MessageButton()
                .setStyle('gray')
                .setLabel('▣')
                .setID('button_select');


            let buttons = new MessageActionRow()
                .addComponents(buttonLEFT, buttonRIGHT, buttonSELECT);

            let buttonsEmpty = new MessageActionRow()
            
            let msgPromise = await message.channel.send(embedENG, buttons);

            const ButtonCollector = msgPromise.createButtonCollector((button) => button.clicker.user.id === message.author.id, { time: 15000 });

            let choosenLocale = 'eng';

            ButtonCollector.on('collect', (b) => {
                b.reply.defer();
                if (b.id == 'button_left') {
                    msgPromise.edit(embedENG, buttons);
                    choosenLocale = 'eng';
                } else if (b.id == 'button_right') {
                    msgPromise.edit(embedRUS, buttons);
                    choosenLocale = 'rus';
                } else if (b.id == 'button_select') {
                    ButtonCollector.stop('cancel')
                };
                ButtonCollector.resetTimer();
            });

            ButtonCollector.on('end', (collected, reason) => {
                let embedEND = new Discord.MessageEmbed()
                    .setTitle("Locale-system.")
                    .setDescription(client.CACHE.loc[choosenLocale].native + client.CACHE.loc[choosenLocale].change_lang.langSet)

                client.connection.query(`UPDATE user_preferences SET language = '${choosenLocale}' WHERE userID=${message.author.id};`);
                client.bot.users.preferences.set(message.author.id, choosenLocale);
                msgPromise.edit(embedEND);
                setTimeout(function () {
                    msgPromise.delete();
                    message.delete();
                }, 2000)
            });
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