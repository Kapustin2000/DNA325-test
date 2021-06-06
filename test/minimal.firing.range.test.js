const assert = require('assert');
const Game = require('../game');

describe('Minimal tower firing range has to be 60.', () => {
    it('should return 60', () => {
        let bots = [
            {
                distance: 800,
                speed: 20
            },
            {
                distance: 800,
                speed: 20
            },
            {
                distance: 800,
                speed: 20
            },
        ];

        let game = new Game(bots, 10);
        game.start;
        return game.calcMinimalFiringRange();
    });
});

describe('Minimal tower firing range has to be 30.', () => {
    it('should return 30', () => {
        let bots = [
            {
                distance: 30,
                speed: 10
            },
            {
                distance: 30,
                speed: 10
            },
            {
                distance: 30,
                speed: 10
            },
        ];

        let game = new Game(bots, 10);
        game.start;

        return game.calcMinimalFiringRange();
    });
});

describe("We can't win game.", () => {
    it('should return false', () => {
        let bots = [
            {
                distance: 30,
                speed: 20
            },
            {
                distance: 30,
                speed: 20
            },
            {
                distance: 30,
                speed: 20
            },
        ];

        let game = new Game(bots, 10);
        game.start;
        return game.calcMinimalFiringRange();
    });
});