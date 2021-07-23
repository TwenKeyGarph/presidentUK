// consts

// export
module.exports = {
    code: 'eng',
    name: 'English',
    native: 'English',
    execute(client) {
        client.CACHE.loc.eng = [];
        client.CACHE.loc.eng.c = [];
        client.CACHE.loc.eng.c.pp = require('./eng/c/ping-pong.json');
    },
};