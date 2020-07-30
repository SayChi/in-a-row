'use strict';

let Benchmark = require('./benchmark.js');

class DepthBenchmark {
	constructor(maxDepth) {
		this.maxDepth = maxDepth;
	}

	run() {
		let allData = [];

		for(let depth = 1; depth <= this.maxDepth; depth++) {
			console.log(`---- DEPTH TEST AT ${depth} ----`);
			let data = new Benchmark(depth).run();
			console.table(data);
			allData[depth] = data;
		}

		console.log(`---- ALL ----`);
		console.table(allData);
	}
}

module.exports = DepthBenchmark;