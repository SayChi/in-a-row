'use strict';

let Game = require('./game.js');
let Cache = require('./cache.js');
let AI = require('./ai.js');
let Counters = require('./counters.js');

class Benchmark {
	constructor(depth) {
		this.depth = depth;
	}

	run() {
		let field = Game.createField();
		let winMask = Game.createWinMask();

		let counters = new Counters();
		let cache = new Cache();
		let ai = new AI(winMask);

		counters.clear();
		cache.clearCache(true);

		let startTime = (new Date()).getTime();
		let data = ai.buildPredictionTree(field, 1, this.depth);
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