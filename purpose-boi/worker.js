'use strict';

let {workerData, parentPort} = require('worker_threads');
let AI = require('./ai.js');
let Cache = require('./cache.js');

let cache = new Cache(workerData.cache.cache);
let result = new AI(workerData.winMask).buildPredictionTree(workerData.field, workerData.player, workerData.depth);

parentPort.postMessage({
	result,
	cache
});