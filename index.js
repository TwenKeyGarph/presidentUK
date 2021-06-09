// [CONSTS]
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const config = require('./config/general.json');
client.prefix = config.prefix;
const fs = require('fs');

/*
 * ================== * 
// [COMMAND_HANDLER]
 * ================== *
*/
// init cmds
const commandFiles = fs.readdirSync('./common/commands').filter(file => file.endsWith('.js'));

// load cmds
for (const file of commandFiles) {
    const command = require(`./common/commands/${file}`);
    try {
        client.commands.set(command.name, command); // console.log(`${file} success.`); // dbg
    } catch (error) {
        console.log(`${file}:\n${error}`);
    }
}

// caching aliases
client.CACHE = new Map();
for (const comm of client.commands.keys()) {
    for (const alias of client.commands.get(comm).aliases) {
        client.CACHE.set(alias, comm); // console.log(`${alias} associated to ${comm}`); // dbg
    }
}


/*
 * ================== *
// [EVENT_HANDLER]
 * ================== *
*/
// init events
const eventFiles = fs.readdirSync('./common/events').filter(file => file.endsWith('.js'));

// load events
for (const file of eventFiles) {
    const event = require(`./common/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// sec funcs
client.getCmdByAlias = (cmd) => {
    return client.commands.get(client.CACHE.get(cmd));
};

// main
client.login(config.token);