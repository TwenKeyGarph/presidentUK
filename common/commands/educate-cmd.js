// consts
const i18n = require('i18n');
const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');
const Task = class {
    constructor(arg_quest, arg_answ, arg_id) {
        this.taskid = arg_id;
        this.head = arg_quest.head;
        this.desc = arg_quest.desc;
        this.variants = arg_answ;

        for (let i = this.variants.length - 1; i > 0; i--) { // shuffle method by FisherYates
            let j = Math.floor(Math.random() * (i + 1));
            [this.variants[i], this.variants[j]] = [this.variants[j], this.variants[i]];
        }
    }

    get answers() {
        return this.variants
    }

    formDiscordEmbed(msg, taskN, tasks) {
        let embed = new Discord.MessageEmbed()
            .setTitle(`Вопрос №${taskN + 1}/${tasks}. ${this.head}`)
            .setDescription(this.desc)
            .setColor('#36A4CF')
            .setFooter("На решение даётся #N секунд.")
            .setThumbnail("https://cdn.discordapp.com/embed/avatars/0.png")
            .setImage("")
            .setAuthor(msg.author.username, msg.author.avatarURL());
            //.addField(":flag_gb: __English__", "USA and UK", true)
            //.addField(":flag_ru: Russian", "CIS countries", true);

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
}


// export
module.exports = {
    name: 'educate-cmd',
    aliases: ['educate', 'edu'],
    example: 'edu',
    async execute(client, message, args) {
        const sessionID = message.author.id;
        const locale = message.author.loc;

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
        TASKS.set(INDEX[0], new Task({ head: "Арифметика", desc: "_Натуральный логарифм числа_ `e`" }, [{ id: 0, head: "1", desc: "ну типа 1" }, { id: 1, head: "е", desc: "ну типа е" }, { id: 2, head: "0", desc: "ну типа 0" }, { id: 3, head: "нет", desc: "ну типа нет" }, { id: 4, head: "бесконечность", desc: "ну типа бесконечность" }]), INDEX[0]);
        TASKS.set(INDEX[1], new Task({ head: "Философия", desc: "_Быть или не быть?_" }, [{ id: 0, head: "или", desc: "ну типа или" }, { id: 1, head: "не быть", desc: "ну типа не быть" }, { id: 2, head: "быть" }]), INDEX[1]);
        TASKS.set(INDEX[2], new Task({ head: "дефенс оф **", desc: "сейв от ульты легионки" }, [{ id: 0, head: "крест даззла" }, { id: 1, head: "ульта абаддона" }, { id: 2, head: "бкб" }, { id: 3, head: "блинк антимага", desc : "антимаг должен успеть блинкануться до дуэли" }]), INDEX[2]);
        let BALLS = 0;

        let taskNumber = 0; 
        let currentTask;
        currentTask = TASKS.get(taskNumber);

        const msgPromise = await message.channel.send("Тест №1.", { embed: currentTask.formDiscordEmbed(message, taskNumber, TASKS.size), component: currentTask.rowButtons } );
        const ButtonCollector = msgPromise.createButtonCollector((b) => b.clicker.user.id === message.author.id, { time: 15000 });

        ButtonCollector.on('collect', async (b) => {
            if (b.id == 0) {
                BALLS++;
                let replyProm = await message.reply("✅");
                setTimeout(() => replyProm.delete(), 500);
            } else {
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
            msgPromise.edit(`_Баллы:_ ${BALLS}/${TASKS.size} \n${(BALLS / TASKS.size >= 0.65) ? "**Зачет**" : "**Не зачет**"}`, { component: null });
            client.CACHE.educate.splice(client.CACHE.educate.indexOf(sessionID));
        });  
    },
};

