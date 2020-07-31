'use strict';

let DepthBenchmark = require('./../depth-benchmark.js');

let args = process.argv.slice(2);

new DepthBenchmark(
	0 in args ? parseInt(args[0]) : 8
).run(
	1 in args ? args[1] == "true" : true
);