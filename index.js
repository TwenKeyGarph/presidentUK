// consts
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const config = require('./config/general.json');
const fs = require('fs');
// init cmds
const commandFiles = fs.readdirSync('./common/commands').filter(file => file.endsWith('.js'));

// load cmds
for (const file of commandFiles) {
    const command = require(`./common/commands/${file}`);
    try {
        client.commands.set(command.callout, command);
        console.log(`${file} success.`);
    } catch (error) {
        console.log(`${file}:\n${error}`);
    }
}

// main
function main() {
    client.on('ready', () => {
        console.log(`${client.user.username} started.`);
    });
    client.on('warn', (info) => console.log(info));
    client.on('error', console.error);
    client.on('message', (message) => { 
        if (message.author.bot) return 1; // msg from bot
        if (!message.guild) return 2; // msg in DM
        if (!(message.content.startsWith(config.prefix))) return 3; // msg without prefix

        let cmdFull = message.content.slice(config.prefix.length); 
        let cmdArgs = cmdFull.split(' ');
        let cmdCall = cmdArgs.shift().toLowerCase();

        if (!client.commands.has(cmdCall)) return 4;
        const cmd = client.commands.get(cmdCall);
        

        try {
            cmd.execute(client, message, cmdArgs);
        } catch (error) {
            console.error(error);
            message.channel.send(`error caught \`${cmd.sysname}\`:\`${cmd.callout}\`\n\`${error.message}\``);
        }

    });

    client.login(config.token);
}


main();