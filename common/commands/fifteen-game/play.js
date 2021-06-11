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

// export
exports.out = async function (client, message, arg) {
    const sessionID = message.author.id;
    if (client.CACHE.ff.indexOf(sessionID) != -1)
        return 1;
    client.CACHE.ff.push(sessionID);
    message.channel.send(`Session initialized by ${message.author.username}`);
    const Field = new Fifteen(sessionID);
    const msgPromise = await message.channel.send(Field.getFormatDraw());

    const filter = message => message.author.id == sessionID;
    const collector = message.channel.createMessageCollector(filter, { time: 45000 });
    let won_time, won_moves;

    // moves handle
    collector.on('collect', m => {
        console.log(`toMove(${m.content})`);
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
        console.log(`Moves: ${collected.size}`);
        if (reason == 'won') {
            won_time = (Date.now() - msgPromise.createdTimestamp) / 1000
            won_moves = collected.size
            message.reply(`You won! \n It took ${won_time} sec & ${won_moves} moves.`);
        } else if (reason == 'time') {
            reason = 'time out';
        }


        message.channel.send(`Session terminated by ${reason}.`);
        client.CACHE.ff.splice(client.CACHE.ff.indexOf(sessionID));
        let notFound = true;
        if (reason == 'won') {
            let JSONfile = require('./list.json');
            for (place in JSONfile.array) {
                if (sessionID == JSONfile.array[place].sessionID) {
                    notFound = false;
                    if (JSONfile.array[place].won_moves > won_moves) {
                        JSONfile.array[place] = { sessionID, won_time, won_moves };
                        break;
                    } else {
                        break;
                    }
                }
            }
            if(notFound) {
                JSONfile.array.push({ sessionID, won_time, won_moves });
            }
            fss.writeFileSync('./common/commands/fifteen-game/list.json', JSON.stringify(JSONfile));
        }

    });
    return 0;
}
