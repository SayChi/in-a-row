'use strict';

let Benchmark = require('./../benchmark.js');

let args = process.argv.slice(2);

async function run() {
	console.table(
		await new Benchmark(
			0 in args ? parseInt(args[0]) : 8
		).run(
			1 in args ? args[1] == "true" : true
		)
	);
}

run();