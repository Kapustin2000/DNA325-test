const readline = require("readline");
const Game = require('./game');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let bots = [];
let towerFiringDistance = 0;

rl.question("", function (firingDistance) {
    if (firingDistance.match(/^\d{1,}m$/)) {
        towerFiringDistance = Number.parseInt(firingDistance.replace('m', ''));
        return rl.on("line", function (bot) {
            if (bot.match(/^.*\s\d{1,}m\s\d{1,}m$/)) {
                bot = bot.split(' ');
                return bots = bots.concat({
                    name: bot[0],
                    distance: Number.parseInt(bot[1].replace('m', '')),
                    speed: Number.parseInt(bot[2].replace('m', ''))
                });
            }

            return console.log('we have input problems. bot not added');
        });
    }

    return console.log('we have input problems. distance is not set');
});


rl.on("close", function () {
    if (!towerFiringDistance || bots.length < 0) {
        return console.log("We can't start game");
    }
    console.log("===================");
    let game = new Game(bots, towerFiringDistance);

    game.start;

    console.log("Firing range", game.firingRange);

    game.bots.forEach((bot, botNumber) => {
        if (bot.killedAt >= bot.needs && bot.killedAt < game.lostAt || !game.lostAt) {
            console.log(`Turn ${bot.killedAt}: Kill Bot${botNumber + 1} at ${bot.killedAt * bot.speed}m`);
        }
    })

    if (game.lostAt) {
        console.log(`Tower loses in ${game.lostAt} turn(s).`)
    } else {
        console.log(`Tower win in ${game.bots[game.bots.length - 1].killedAt} turn(s).`)
    }

    if (game.lostAt) {
        let minimalFiringRange = game.calcMinimalFiringRange();

        if (minimalFiringRange) {
            return console.log(`Minimal firing range to win game is ${minimalFiringRange}`);
        }

        return console.log('No way to win.')
    }
    process.exit(0);
});
