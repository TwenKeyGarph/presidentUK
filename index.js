// [CONSTS]
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const config = require('./config/general.json');
client.prefix = config.prefix;
const fs = require('fs');
client.CACHE = [];
const mysql = require('mysql');

/*
 * ================== *
// [DATABASE_CONNECTION]
 * ================== *
*/
client.connection = mysql.createConnection({
    host: config.db_host,
    user: config.db_user,
    password: config.db_passw,
    database: config.db_name
});

client.connection.connect(function (err) {
    if (err) {
        console.log(`db not found. some functions can work wrong`)
        return console.error("HEAD_ERROR: " + err.message);     
    }
    else {
        console.log("Database connection established.");
    }
});


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
client.CACHE.alias = new Map();
for (const comm of client.commands.keys()) { 
    for (const alias of client.commands.get(comm).aliases) {
        client.CACHE.alias.set(alias, comm); // console.log(`${alias} associated to ${comm}`); // dbg
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

// sec funcs other with
client.getCmdByAlias = (cmd) => {
    return client.commands.get(client.CACHE.alias.get(cmd));
};

// main
client.login(config.token);