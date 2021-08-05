// [CONSTS]
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
require("discord-buttons")(client);


const config = require('./config/general.json');
client.prefix = config.prefix;
const fs = require('fs');
const path = require('path')
client.CACHE = [];
client.CACHE.privileges = new Map;
const mysql = require('mysql');
const { MessageButton, MessageActionRow } = require('discord-buttons');
require('./common/systems/condebug.js')
client.DEBUG = false;

/*
 * ================== *
// [DATABASE_CONNECTION]
 * ================== *
*/
client.connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name
});


console.time('__db_connect')
console.debug(`HEAD_DB connecting...`)
client.connection.connect(function (err) {
    if (err) {
        console.debug(`HEAD_DB not found; Some funcs can work wrong`)
        if (client.DEBUG)
            return console.error("HEAD_ERROR: " + err.message);
    } else {
        console.timeEnd('__db_connect')
        console.debug("HEAD_DB connection established.");
    }
});


// caching privileges
console.debug(`HEAD_PRIVELEGES loading...`);
client.connection.query(`SELECT userID, priv FROM privileges;`, function (error, results, fields) {  
    if (error) throw error;
    console.debug(`HEAD_PRIVELEGES loading done, caching...`);
    results.forEach(elem => {
        const JSONelem = JSON.parse(JSON.stringify(elem))
        console.debug(`\t.set(${JSONelem.userID} - ${JSONelem.priv})`);
        client.CACHE.privileges.set(JSONelem.userID, JSONelem.priv);
    });
    console.debug(`HEAD_PRIVELEGES caching done.`);
});





/*
 * ================== * 
// [COMMAND_HANDLER]
 * ================== *
*/
// init cmds
const commandFiles = fs.readdirSync('./common/commands').filter(file => file.endsWith('.js'));

// load cmds
console.debug(`HEAD_CMDHANDLER processing...`);
for (const file of commandFiles) {
    const command = require(`./common/commands/${file}`);
    try {
        client.commands.set(command.name, command);
        console.debug(`\t${file} success.`);
    } catch (error) {
        console.log(`\t${file}:\n${error}`);
    }
}
console.debug(`HEAD_CMDHANDLER processing done, caching aliases...`);

// caching aliases
client.CACHE.alias = new Map();
for (const comm of client.commands.keys()) { 
    for (const alias of client.commands.get(comm).aliases) {
        client.CACHE.alias.set(alias, comm);
        console.debug(`\t${alias} associated to ${comm}`);
    }
}
console.debug(`HEAD_CMDHANDLER caching done.`);


/*
 * ================== *
// [EVENT_HANDLER]
 * ================== *
*/
// init events
const eventFiles = fs.readdirSync('./common/events').filter(file => file.endsWith('.js'));

// load events
console.debug(`HEAD_EVENTHANDLER processing...`);
for (const file of eventFiles) {
    const event = require(`./common/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.debug(`\t(${(event.once) ? 'once' : ' on '})${file} success.`);
}
console.debug(`HEAD_EVENTHANDLER processing done.`);

// sec funcs other with
client.getCmdByAlias = (cmd) => {
    return client.commands.get(client.CACHE.alias.get(cmd));
};

// main
client.login(config.token);
console.debug(`HEAD token authorized.`)

