// consts
const i18n = require('i18n');

// export
module.exports = {
    name: 'about-cmd',
    aliases: ['help','about'],
    example: 'help [cmd]',
    execute(client, message, args) {
        let arg = args[0];
        const locale = message.author.loc;

        if (client.CACHE.alias.has(arg)) {
            cmd = client.getCmdByAlias(arg).name
            message.reply(client.getCmdByAlias(arg).aliases[0] + ': ' + i18n.__(
                                                                        { phrase: `${cmd}.about`, locale: locale }));
        } else {
            if (!arg) arg = ' ';
            message.reply(i18n.__mf(
                { phrase: 'about-cmd.wrongArg', locale: locale },
                { cmd: arg }
            ));
        }
    },
};