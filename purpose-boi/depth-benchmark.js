'use strict';

let Benchmark = require('./benchmark.js');

class DepthBenchmark {
	constructor(maxDepth) {
		this.maxDepth = maxDepth;
	}

	async run(multithreaded = true) {
		let allData = [];

		for(let depth = 1; depth <= this.maxDepth; depth++) {
			console.log(`---- DEPTH TEST AT ${depth} ----`);
			let data = await new Benchmark(depth).run(multithreaded);
			console.table(data);
			allData[depth] = data;
		}

		console.log(`---- ALL ----`);
		console.table(allData);
	}
}

module.exports = DepthBenchmark;