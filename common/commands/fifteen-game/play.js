// consts
Fifteen = class {
    constructor(id) {
        this.id = id;
        this.board = [[15, 14, 13, 12], [11, 10, 9, 8], [7, 6, 5, 4], [3, 1, 2, -1]];
    }

    getID() {
        return this.id;
    }

    toCheat() {
        this.board = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, -1, 15]];
    }

    isWon() {
        let D = 1;
        let isWon = true;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] != D++ && this.board[i][j] != -1) {
                    isWon = false;
                }
            }
        }
        return isWon
    }

    getFormatDraw() {
        let result = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                switch (this.board[i][j]) {
                    case 1:
                        result += ':zero::one:';
                        break;
                    case 2:
                        result += ':zero::two:';
                        break;
                    case 3:
                        result += ':zero::three:';
                        break;
                    case 4:
                        result += ':zero::four:';
                        break;
                    case 5:
                        result += ':zero::five:';
                        break;
                    case 6:
                        result += ':zero::six:';
                        break;
                    case 7:
                        result += ':zero::seven:';
                        break;
                    case 8:
                        result += ':zero::eight:';
                        break;
                    case 9:
                        result += ':zero::nine:';
                        break;
                    case 10:
                        result += ':one::zero:';
                        break;
                    case 11:
                        result += ':one::one:';
                        break;
                    case 12:
                        result += ':one::two:';
                        break;
                    case 13:
                        result += ':one::three:';
                        break;
                    case 14:
                        result += ':one::four:';
                        break;
                    case 15:
                        result += ':one::five:';
                        break;
                    default:
                        result += ':blue_square::blue_square:';
                        break;
                }
                result += ':yellow_square:';
            }
            result += '\n:yellow_square::yellow_square::yellow_square::yellow_square:';
            result += ':yellow_square::yellow_square::yellow_square::yellow_square:';
            result += ':yellow_square::yellow_square::yellow_square::yellow_square:\n';
        }
        return result;
    }

    toRawDraw() {
        console.log(this.board);
        let res = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                res += this.board[i][j] + ' ';
            }
            res += '\n';
        }
        console.log(res);
    }

    toMoveByNumber(number) {
        let target, empty;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.board[i][j] == number)
                    target = [i, j]
                else if (this.board[i][j] == -1)
                    empty = [i, j];
            }
        }
        if (target[0] == empty[0]) {
            if (target[1] - empty[1] >= -1 && target[1] - empty[1] <= 1) {
                this.board[target[0]][target[1]] = -1;
                this.board[empty[0]][empty[1]] = number;
            }
        }
        if (target[1] == empty[1]) {
            if (target[0] - empty[0] >= -1 && target[0] - empty[0] <= 1) {
                this.board[target[0]][target[1]] = -1;
                this.board[empty[0]][empty[1]] = number;
            }
        }
    }
}
const fss = require('fs');
const i18n = require('i18n');

// export
exports.out = async function (client, message, arg) {
    const sessionID = message.author.id;
    const locale = message.author.loc;

    if (client.CACHE.fifteen.indexOf(sessionID) != -1)
        return 1;
    client.CACHE.fifteen.push(sessionID);
    console.debug(`\tsession created (${sessionID})`);
    message.channel.send(i18n.__mf(
        { phrase: 'fifteen-game.playStart', locale: locale },
        { author: message.author.username } ));
    const Field = new Fifteen(sessionID);
    const msgPromise = await message.channel.send(Field.getFormatDraw());

    const filter = message => message.author.id == sessionID;
    const collector = message.channel.createMessageCollector(filter, { time: 45000 });
    let wonTime, wonMoves;

    // moves handle
    collector.on('collect', m => {
        console.debug(`\ttoMove(${m.content})`); // dbg
        if (m.content == 'cancel') {
            collector.stop('cancel');
        } else if (m.content == 'cheat') {
            Field.toCheat();
            msgPromise.edit(Field.getFormatDraw());
        }
        let num = Number(m.content);
        if (num > 0 && num < 16) {
            Field.toMoveByNumber(num);
            if (Field.isWon()) {
                msgPromise.edit(Field.getFormatDraw());
                collector.stop('won');
            }
            else {
                msgPromise.edit(Field.getFormatDraw());
            }
        } 
        collector.resetTimer();
        m.delete();
    });
    // finish game
    collector.on('end', (collected, reason) => {
        console.debug(`\tmoves: ${collected.size}`);
        console.debug(`\treason ${reason}`)
        let locReason;
        if (reason == 'won') {      
            wonTime = (Date.now() - msgPromise.createdTimestamp) / 1000
            wonMoves = collected.size
            message.reply(i18n.__mf(
                { phrase: 'fifteen-game.playWon', locale: locale },
                { time: wonTime, moves: wonMoves}
            ));
            locReason = i18n.__(
                { phrase: 'fifteen-game.reasonWon', locale: locale });
        } else if (reason == 'time') {
            locReason = i18n.__(
                { phrase: 'fifteen-game.reasonTime', locale: locale });
        } else {
            locReason = i18n.__(
                { phrase: 'fifteen-game.reasonCancel', locale: locale });
        }
        message.channel.send(i18n.__mf(
            { phrase: 'fifteen-game.playFinished', locale: locale },
            { reason: locReason }));
        client.CACHE.fifteen.splice(client.CACHE.fifteen.indexOf(sessionID));
        console.debug(`\tsession removed (${sessionID})`);
        // storing into leaderboardfile
        if (reason == 'won') {
            client.connection.query(`SELECT wonMoves FROM fifteengame_leaderboard WHERE sessionID = '${sessionID}'`, function (error, results, fields) {
                if (error) throw error;
                if (!(results[0])) { // is result not found
                    console.debug('\tinserting new result..')
                    client.connection.query(`INSERT INTO fifteengame_leaderboard (sessionID, wonMoves, wonTime) VALUES (${sessionID}, ${wonMoves}, ${wonTime});`);
                } else if (JSON.parse(JSON.stringify(results[0])).wonMoves >= wonMoves) { // update worst result
                    // console.log(JSON.parse(JSON.stringify(results[0])).wonMoves); // dbg
                    console.debug('\tupdating old result..')
                    client.connection.query(`UPDATE fifteengame_leaderboard SET wonMoves = ${wonMoves}, wonTime = ${wonTime} WHERE sessionID = '${sessionID}';`)
                }
            });
        }
        console.debug('CMD_FIFTEEN-GAME end');
    });
    return 0;
}
