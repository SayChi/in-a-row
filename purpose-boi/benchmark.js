'use strict';

let Game = require('./game.js');
let Cache = require('./cache.js');
let AI = require('./ai.js');
let Counters = require('./counters.js');

class Benchmark {
	constructor(depth) {
		this.depth = depth;
	}

	async run(multithreaded = true) {
		let field = Game.createField();
		let winMask = Game.createWinMask();

		let counters = new Counters();
		let cache = new Cache();
		let ai = new AI(winMask);

		counters.clear();
		cache.clearCache(true);

		let startTime = (new Date()).getTime();
		let data;
		if (multithreaded) {
			data = await ai.start(field, 1, this.depth);
			data = data.reduce((acc, cur) => ({
				p1Wins: acc.p1Wins + cur.p1Wins,
				p2Wins: acc.p2Wins + cur.p2Wins,
				und: acc.und + cur.und
			}), {p1Wins: 0, p2Wins: 0, und: 0});
		}else {
			data = ai.buildPredictionTree(field, 1, this.depth);
		}
		let endTime = (new Date()).getTime();

		Object.assign(data, {
			'run-time': (endTime - startTime) / 1000,
			'steps': counters.stepCounter,
			'p1-prunes': counters.p1PruneCounter,
			'p2-prunes': counters.p2PruneCounter,
			'p1-loss-prunes': counters.p1LossPruneCounter,
			'p2-loss-prunes': counters.p2LossPruneCounter,
			'cache-prunes': counters.cachePruneCounter,
		});
		
		return data;
	}
}

module.exports = Benchmark;