// consts

// export
module.exports = {
    code: 'rus',
    name: 'Russian',
    native: '�������',
    execute(client) {
        client.CACHE.loc.rus = [];
        client.CACHE.loc.rus.c = [];
        client.CACHE.loc.rus.c.pp = require('./rus/c/ping-pong.json');
    },
};