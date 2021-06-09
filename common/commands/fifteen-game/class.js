class Fifteen {
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

    getRawDraw() {
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

    toDraw() {
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
