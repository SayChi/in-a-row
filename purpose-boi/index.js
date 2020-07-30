'use strict';

// let DepthBenchmark = require('./depth-benchmark.js');

// new DepthBenchmark(9).run();

let AI = require('./ai.js');
let Game = require('./game.js');

async function test() {
	let startTime = (new Date()).getTime();
	console.log(await new AI(Game.createWinMask()).start(Game.createField(), 1, 9));
	let endTime = (new Date()).getTime();
	console.log((endTime - startTime) / 1000);
}

test();