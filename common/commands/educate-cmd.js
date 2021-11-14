// consts
const i18n = require('i18n');
const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');
const Task = class {
    constructor(arg_quest, arg_answ, arg_id) {
        this.taskid = arg_id;
        this.head = arg_quest.head;
        this.desc = arg_quest.desc;
        this.url = arg_quest.url;
        this.variants = arg_answ;

        for (let i = this.variants.length - 1; i > 0; i--) { // shuffle method by FisherYates
            let j = Math.floor(Math.random() * (i + 1));
            [this.variants[i], this.variants[j]] = [this.variants[j], this.variants[i]];
        }
    }

    get heading() {
        return this.head;
    }

    get answers() {
        return this.variants
    }

    formDiscordEmbed(msg, taskN, tasks) {
        let varINDEX = 1;
        let embed = new Discord.MessageEmbed()
            .setTitle(`Вопрос №${taskN + 1}/${tasks}. ${this.head}`)
            .setDescription(this.desc)
            .setColor('#36A4CF')
            .setFooter("На решение даётся 20 секунд.")
            .setThumbnail("https://cdn.discordapp.com/embed/avatars/0.png")
            .setAuthor(msg.author.username, "https://cdn.discordapp.com/embed/avatars/0.png"); // msg.author.avatarURL()
        if (this.url)
            embed.setImage(this.url);
        for (let i in this.variants) {
            if (this.variants[i].desc)
                embed.addField(`__${varINDEX++}.__ ${this.variants[i].head}`, this.variants[i].desc);
        }
        return embed;
    }

    get rawToMsg() {
        return `**${this.head}**\n${this.desc}`;
    }

    get rowButtons() {
        let buttons = new MessageActionRow();

        for (let i in this.variants) {
            let button = new MessageButton()
                .setStyle('blurple')
                .setLabel(this.variants[i].head)
                .setID(this.variants[i].id);
            buttons.addComponent(button);
        }
        return buttons;
    }

    getRemarkByVariantID(Bid) {
        for (var i = 0; i < this.variants.length; i++) {
            if (this.variants[i].id == Bid) {
                return this.variants[i].remark;
            }
        }
    }
}


// export
module.exports = {
    name: 'educate-cmd',
    aliases: ['educate', 'edu'],
    example: 'edu',
    async execute(client, message, args) {
        const sessionID = message.author.id;
        const locale = message.author.loc;

        message.delete();
        if (client.CACHE.educate.indexOf(sessionID) != -1)
            return 1;
        client.CACHE.educate.push(sessionID);
        console.debug(`\tsession created (${sessionID})`);

        

        let INDEX = [0, 1, 2];

        for (let i = INDEX.length - 1; i > 0; i--) { // shuffle method by FisherYates
            let j = Math.floor(Math.random() * (i + 1));
            [INDEX[i], INDEX[j]] = [INDEX[j], INDEX[i]];
        }

        let TASKS = new Map();
        TASKS.set(INDEX[0], new Task({ head: "Математика", desc: "_Натуральный логарифм числа_ `e`" }, [
            { id: 0, head: "1" },
            { id: 1, head: "е" },
            { id: 2, head: "0" },
            { id: 3, head: "нет" },
            { id: 4, head: "бесконечность" }]
        ), INDEX[0]);
        TASKS.set(INDEX[1], new Task({ head: "Философия", desc: "_Быть или не быть?_", url: "https://cdnmyslo.ru/BlogArticle/4f/d3/4fd3a225-942d-407d-8cd5-0a8dbcb5f864_1.jpg" }, [
            { id: 0, head: "или" },
            { id: 1, head: "не быть" },
            { id: 2, head: "быть" }]
        ), INDEX[1]);
        TASKS.set(INDEX[2], new Task({ head: "История", desc: "В каком городе было проведено СБСЕ? (1973)" }, [
            { id: 0, head: "Хельсинки" },
            { id: 1, head: "Женева", remark: "В Женеве собирались на втором этапе." },
            { id: 2, head: "Москва", remark: "В Москве собирались значительно позже." }]
        ), INDEX[2]);

        let BALLS = 0;

        let taskNumber = 0;
        let currentTask;
        currentTask = TASKS.get(taskNumber);
        console.time("__educate-cmd. collector");
        const msgPromise = await message.channel.send("Тест №1.", { embed: currentTask.formDiscordEmbed(message, taskNumber, TASKS.size), component: currentTask.rowButtons } );
        const ButtonCollector = msgPromise.createButtonCollector((b) => b.clicker.user.id === message.author.id, { time: 20000 });
        let REMARKS = [];

        ButtonCollector.on('collect', async (b) => {
            console.debug(`\tselect(${b.id})`);
            if (b.id == 0) {
                BALLS++;
                let replyProm = await message.reply("✅");
                setTimeout(() => replyProm.delete(), 500);
            } else {
                let ans = currentTask.answers.find(elem => elem.id == b.id);
                if (ans.remark) {
                    let body = ans.remark;
                    let correct = currentTask.answers.find(elem => elem.id == 0).head;
                    let name = currentTask.heading;
                    let uncorrect = ans.head;
                    REMARKS.push({name, body, correct, uncorrect })
                }


                let replyProm = await message.reply("❎");
                setTimeout(() => replyProm.delete(), 500);
            }

            currentTask = TASKS.get(++taskNumber);
            
            if (taskNumber >= TASKS.size) {
                b.reply.defer();
                ButtonCollector.stop('overflow');
            } else {
                msgPromise.edit({ embed: currentTask.formDiscordEmbed(message, taskNumber, TASKS.size), component: currentTask.rowButtons } );
                ButtonCollector.resetTimer();
                b.reply.defer();
            }
        });


        ButtonCollector.on('end', (collected, reason) => {
            console.timeEnd("__educate-cmd. collector");
            let embed = new Discord.MessageEmbed()
                .setTitle(`Итог.`)
                .setDescription(`_Баллы:_ ${BALLS}/${TASKS.size} \n${(BALLS / TASKS.size >= 0.65) ? "**Зачет**" : "**Не зачет**"}`)
                .setColor('#36A4CF')
                .setThumbnail("https://cdn.discordapp.com/embed/avatars/0.png")
                .setImage()
                .setAuthor(message.author.username, "https://cdn.discordapp.com/embed/avatars/0.png"); //  msg.author.avatarURL()
            for (let i in REMARKS) {
                embed.addField(`${REMARKS[i].name}: ~~${REMARKS[i].uncorrect}~~`, `${REMARKS[i].body} (Верный ответ <${REMARKS[i].correct}>)`);
            }
            if (REMARKS.length != 0) {
                embed.setDescription(`_Баллы:_ ${BALLS}/${TASKS.size} \n${(BALLS / TASKS.size >= 0.65) ? "**Зачет**" : "**Не зачет**"} \nРабота над ошибками:`);
            }

            msgPromise.edit({ embed : embed, component: null });
            client.CACHE.educate.splice(client.CACHE.educate.indexOf(sessionID));
            console.debug(`\session removed (${sessionID})`);
            console.debug("CMD_EDUCATE-CMD end.")
        });  
    },
};

