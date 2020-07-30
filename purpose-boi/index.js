'use strict';

// let DepthBenchmark = require('./depth-benchmark.js');

// new DepthBenchmark(9).run();

let AI = require('./ai.js');
let Game = require('./game.js');

async function test() {
	console.log(await new AI(Game.createWinMask()).start(Game.createField(), 1, 9));
}

test();