// consts
const i18n = require('i18n');
const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');

// export
module.exports = {
    name: 'educate-cmd',
    aliases: ['educate', 'edu'],
    example: 'edu',
    async execute(client, message, args) {
        const sessionID = message.author.id;
        const locale = message.author.loc;


        class Task {
            constructor(quest, answ, id) {
                this.head = quest.head;
                this.desc = quest.desc;
                this.type = (answ.type) ? answ.type : 0;
                switch (this.type) {
                    case 1:
                        this.correct = answ.variants[0];
                        this.answers = answ.variants;
                        for (let i = this.answers.length - 1; i > 0; i--) { // shuffle method by Fisher–Yates
                            let j = Math.floor(Math.random() * (i + 1));
                            [this.answers[i], this.answers[j]] = [this.answers[j], this.answers[i]];
                        }
                        break;

                    default:
                        this.correct = answ;
                }
            }


            solution(resp) {
                switch (this.type) {
                    default:
                        if (resp == this.correct)
                            return true;
                        return false;
                }
            }


            getType() {
                return this.type;
            }

            get rawToMsg() {
                return `${this.head} \n ${this.desc}`
            }
        }




        let tasks = new Map();
        tasks.set(0, new Task({ head: "head0", desc: "desc0" }, { type: 1, variants: ["123", "132", "321"] }), 0);
        tasks.set(1, new Task({ head: "head1", desc: "desc1" }, "123"), 1);
        tasks.set(2, new Task({ head: "head2", desc: "desc2" }, "123"), 2);

        if (client.CACHE.educate.indexOf(sessionID) != -1)
            return 1;
        client.CACHE.educate.push(sessionID);
        console.debug(`\tsession created (${sessionID})`);


        let taskNumber = 0;
        let currentTask = tasks.get(taskNumber);
        const msgPromise = await message.channel.send(currentTask.rawToMsg);

        start:
        if (currentTask.type == 1) {
            let buttonID = 0;
            let buttons = new MessageActionRow();
            for (element in currentTask.variants) {
                let button = new MessageButton()
                    .setStyle('blurple')
                    .setLabel(element)
                    .setID(buttonID++);
                buttons.addComponent(button);
            }

            let msgPromise = await message.channel.send(currentTask.rawToMsg, buttons);

        } else {
            const filter = message => message.author.id == sessionID;
            const msgCollector = message.channel.createMessageCollector(filter, { time: 3000 });
        }
        
        

    },
};

