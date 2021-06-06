var _ = require('lodash');

module.exports = class Game {
    lostAt = false;
    firingRange = 0;

    /**
     * constructor
     * @param        bots array of opponents
     * @param        firingRange integer Tower firing range
     */
    constructor(bots, firingRange) {
        this.firingRange = firingRange;
        this.bots = this.prepareBots(bots);
    }

    /**
     * Start game function.
     * It calculates on which turn each bot will be killed.
     * It calculates when we lost game.
     */
    get start() {
        this.lostAt = false;
        this.bots.forEach((bot, botNumber) => {
            let behindBot = this.bots[botNumber - 1];
            this.calculateDeath(bot, behindBot);

            if (bot.killedAt > bot.needs && !this.lostAt) {
                if (!behindBot) {
                    return this.lostAt = 1;
                }

                return this.lostAt = behindBot.killedAt + 1;
            }
        });
    }

    /**
     * Calculate bot death function.
     * If bot is first, then he is killed after he is available to tower.
     * If bot has same distance as previous bot, then bot is killed right after him.
     * If bot is not available on this turn, then we will calculate when he is available for kill.
     */
    calculateDeath(bot, behindBot = false) {
        if (!behindBot) {
            return bot.killedAt = bot.availableFrom;
        }

        if (behindBot.killedAt >= bot.availableFrom) {
            return bot.killedAt = behindBot.killedAt + 1;
        }

        return bot.killedAt = behindBot.killedAt + (
            bot.availableFrom - behindBot.killedAt
        );
    }

    /**
     * Prepare bots function.
     * We need to calculate how many turns each bot has to do, before he reaches the tower.
     * We need to calculate from which turn bot is available to kill by tower.
     * We have to sort bots, so first comes bots, that has the lowest distance to tower and has the lowest amount of turns he has to do before he reaches tower. So far each next bot can has same distance as previous, but not higher.
     */
    prepareBots(bots) {
        bots.forEach((bot, botNumber) => {
            bot.needs = bot.distance / bot.speed;
            bot.availableFrom = Math.max(1, Math.ceil((bot.distance - this.firingRange) / bot.speed) + 1);
        });

        return _.orderBy(bots, [
            function (item) {
                return item.availableFrom;
            },
            function (item) {
                return item.needs;
            }
        ], ["asc", "asc"]);
    }

    /**
     * Calculate minimal tower firing range.
     * We have to take the farthest bot distance and take it as tower firing distance. If we can't still win game, then it is not possible.
     * We start to reduce firing distance. For example we lose with firing distance 40m, but win with 50m. So the minimal firing distance is somewhere between 40 and 50.
     * We collect all possible firing distances, that suit our game conditions. And then we return the lowest.
     * In cycle as a limit we can specify how clear our answer has to be. If we have to also think about float number, then it is better to put more than 10.
     */
    calcMinimalFiringRange() {
        let winFiringRange = [];
        let lostFiringRange = [];
        let analyzer = new Game(this.bots, this.bots[this.bots.length - 1].distance);
        analyzer.start;

        if (analyzer.lostAt) {
            return false;
        }

        for (let i = 0; i < 20; i++) {
            if (analyzer.lostAt) {
                lostFiringRange.push(Math.floor(analyzer.firingRange));
                if (winFiringRange.length > 0) {
                    let closestWinFiringDistance = winFiringRange.sort((a, b) => Math.abs(analyzer.firingRange - a) - Math.abs(analyzer.firingRange - b))[0];
                    analyzer.firingRange = (closestWinFiringDistance + analyzer.firingRange) / 2;
                    if (Math.floor(closestWinFiringDistance) - Math.floor(analyzer.firingRange) === 1) {
                        //exit of function.
                        i = 20;
                    }
                } else {
                    analyzer.firingRange = analyzer.firingRange * 1.5;
                }
            } else {
                winFiringRange.push(Math.floor(analyzer.firingRange));
                if (lostFiringRange.length > 0) {
                    let closestLoseFiringDistance = lostFiringRange.sort((a, b) => Math.abs(analyzer.firingRange - a) - Math.abs(analyzer.firingRange - b))[0];
                    analyzer.firingRange = (closestLoseFiringDistance + analyzer.firingRange) / 2;
                    if (Math.floor(analyzer.firingRange) - Math.floor(closestLoseFiringDistance) === 1) {
                        //exit of function.
                        i = 20;
                    }
                } else {
                    analyzer.firingRange = analyzer.firingRange * 0.5;
                }
            }

            analyzer.bots = analyzer.prepareBots(analyzer.bots);
            analyzer.start;
        }

        return _.min(winFiringRange);
    }
}