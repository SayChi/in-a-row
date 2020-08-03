'use strict';

let {parentPort} = require('worker_threads');
let AI = require('./ai.js');
let Cache = require('./cache.js');
let Counters = require('./counters.js');

parentPort.on('message', workerData => {
	Cache.destroy();
	let cache = new Cache(workerData.cache);
	let result = new AI(workerData.winMask).buildPredictionTree(workerData.field, workerData.player, workerData.depth);
	cache.clearCache();

	parentPort.postMessage({
		result,
		cache: cache.cache,
		counters: new Counters().getAll()
	});
});