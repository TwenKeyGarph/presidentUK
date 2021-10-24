// consts
const i18n = require('i18n');

// export
module.exports = {
    name: 'black-jack',
    aliases: ['black-jack', 'bj'],
    example: 'black-jack',
    execute(client, message, args) {
        const locale = message.author.loc;


        class Deck {
            #suits;
            #values;

            constructor(id) {
                this.#suits = ["♠", "♣", "♥", "♦"]; // spades b♠ clubs b♣ hearts r♥ diamonds r♦
                this.#values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
                this.serialNum = id;
            }

            init() {
                this.pack = [];
                this.#values.forEach(value => {
                    this.#suits.forEach(suit => {
                        this.pack.push({ value: value, suit: suit });
                    });
                });
            }

            shuffle() {
                if (!this.pack)
                    return 1;
                for (let i = this.pack.length - 1; i > 0; i--) { // shuffle method by Fisher–Yates
                    let j = Math.floor(Math.random() * (i + 1));

                    [this.pack[i], this.pack[j]] = [this.pack[j], this.pack[i]]; // swap
                }
                return 0;
            }

            take() {
                if (this.pack)
                    return this.pack.pop()
            }

            get content() {
                if (this.pack)
                    return this.pack;
            }

            get serial() {
                return this.serialNum;
            }

            

        }

        class Blackjack extends Deck {

            constructor(id) {
                super(id);
                this.score = 0;
                this.init();
                this.shuffle();
            }

            hit() {
                let card = this.take()
                if (!card)
                    return 1;

                if (card.value == 'A') {
                    this.score += (this.score + 11 > 21) ? 1 : 11;
                } else if (isNaN(card)) {
                    this.score += 10;
                } else {
                    this.score += card.value * 1;
                }
                return card;
            }

            
            rawToMsg(card) {
                if (!card)
                    return 1;
                let result = card.suit;
                switch (card.value) {
                    case 'A':
                        result += ' Ace';
                        break;
                    case 'K':
                        result += ' King';
                        break;
                    case 'Q':
                        result += ' Queen';
                        break;
                    case 'J':
                        result += ' Jack';
                        break;
                    default:
                        result += ` ${card.value}`;
                }
                return result;
            }
        };

        let bj = new Blackjack(1);

        
        message.channel.send('https://tenor.com/view/worldxm-shuffle-cards-cardistry-gif-16035579');

        message.channel.send(bj.rawToMsg(bj.hit()));
        message.delete();
    },
};

