const assert = require('assert');
const Game = require('../game');
let bots = [
    {
        name: "Bot0",
        distance: 30,
        speed: 10,
    },
    {
        name: "Bot1",
        distance: 30,
        speed: 10,
    },
    {
        name: "Bot3",
        distance: 50,
        speed: 10,
    }
];

let game = new Game(bots, 10);
game.start;

describe('First bot is killed when he is available for tower', () => {
    it('should return true', () => {
        game.calculateDeath(bots[0]);
        return game.bots[0] === game.bots[0].availableFrom;
    });
});

describe('If bot is same distance as previous, then bot is killed right after first.', () => {
    it('should return true', () => {
        return game.bots[0].killedAt === game.bots[1].killedAt + 1;
    });
});

describe('Bot can be killed only when he is available.', () => {
    it('should return true', () => {
        return game.bots[2].killedAt >= game.bots[2].availableFrom;
    });
});