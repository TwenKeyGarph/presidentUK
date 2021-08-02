// [CONSTS]
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
require("discord-buttons")(client);


const config = require('./config/general.json');
client.prefix = config.prefix;
const fs = require('fs');
client.CACHE = [];
client.CACHE.privileges = new Map;
const mysql = require('mysql');
const { MessageButton, MessageActionRow } = require('discord-buttons');

client.DEBUG = true;

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

if (client.DEBUG) console.log(`HEAD_DB connecting...`)
client.connection.connect(function (err) {
    if (err) {
        if (client.DEBUG) console.log(`HEAD_DB not found; Some funcs can work wrong`)
        if (client.DEBUG)
            return console.error("HEAD_ERROR: " + err.message);
    } else {
        if (client.DEBUG) console.log("HEAD_DB connection established.");
    }
});


// caching privileges
if (client.DEBUG) console.log(`HEAD_PRIVELEGES loading...`);
client.connection.query(`SELECT userID, priv FROM privileges;`, function (error, results, fields) {  
    if (error) throw error;
    if (client.DEBUG) console.log(`HEAD_PRIVELEGES loading done, caching...`);
    results.forEach(elem => {
        const JSONelem = JSON.parse(JSON.stringify(elem))
        if (client.DEBUG) console.log(`\t.set(${JSONelem.userID} - ${JSONelem.priv})`);
        client.CACHE.privileges.set(JSONelem.userID, JSONelem.priv);
    });
    if (client.DEBUG) console.log(`HEAD_PRIVELEGES caching done.`);
});





/*
 * ================== * 
// [COMMAND_HANDLER]
 * ================== *
*/
// init cmds
const commandFiles = fs.readdirSync('./common/commands').filter(file => file.endsWith('.js'));

// load cmds
if (client.DEBUG) console.log(`HEAD_CMDHANDLER processing...`);
for (const file of commandFiles) {
    const command = require(`./common/commands/${file}`);
    try {
        client.commands.set(command.name, command);
        if (client.DEBUG) console.log(`\t${file} success.`);
    } catch (error) {
        console.log(`\t${file}:\n${error}`);
    }
}
if (client.DEBUG) console.log(`HEAD_CMDHANDLER processing done, caching aliases...`);

// caching aliases
client.CACHE.alias = new Map();
for (const comm of client.commands.keys()) { 
    for (const alias of client.commands.get(comm).aliases) {
        client.CACHE.alias.set(alias, comm);
        if (client.DEBUG) console.log(`\t${alias} associated to ${comm}`);
    }
}
if (client.DEBUG) console.log(`HEAD_CMDHANDLER caching done.`);


/*
 * ================== *
// [EVENT_HANDLER]
 * ================== *
*/
// init events
const eventFiles = fs.readdirSync('./common/events').filter(file => file.endsWith('.js'));

// load events
if (client.DEBUG) console.log(`HEAD_EVENTHANDLER processing...`);
for (const file of eventFiles) {
    const event = require(`./common/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    if (client.DEBUG) console.log(`\t(${(event.once) ? 'once' : ' on '})${file} success.`);
}
if (client.DEBUG) console.log(`HEAD_EVENTHANDLER processing done.`);

// sec funcs other with
client.getCmdByAlias = (cmd) => {
    return client.commands.get(client.CACHE.alias.get(cmd));
};

// main
client.login(config.token);
if (client.DEBUG) console.log(`HEAD token authorized.`)