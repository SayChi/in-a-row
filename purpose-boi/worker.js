'use strict';

let {workerData, parentPort} = require('worker_threads');
let AI = require('./ai.js');
let Cache = require('./cache.js');
let Counters = require('./counters.js');

let cache = new Cache(workerData.cache);
let result = new AI(workerData.winMask).buildPredictionTree(workerData.field, workerData.player, workerData.depth);
cache.clearCache();

parentPort.postMessage({
	result,
	cache: cache.cache,
	counters: new Counters().getAll()
});