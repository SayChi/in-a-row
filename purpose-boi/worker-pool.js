'use strict';

let {Worker} = require('worker_threads');

class WorkerPool {
	constructor(poolSize) {
		if (WorkerPool.instance) {
			return WorkerPool.instance;
		}

		this.workers = [];

		for (var i = 0; i < poolSize; i++) {
			this.workers.push({worker: new Worker('./worker.js'), working: false});
		}

		WorkerPool.instance = this;
	}

	execute(workerData) {
		let availableWorkers = this.workers.filter(workerObject => !workerObject.working);

		if (availableWorkers.length == 0) {throw new Error('not enough workers available')}

		return new Promise((resolve, reject) => {
			let nextAvailableWorker = availableWorkers[0];
			let worker = nextAvailableWorker.worker;

			nextAvailableWorker.working = true;

			let messageHandler = response => {
				resolve(response);
				workerReset(nextAvailableWorker);
			};

			let errorHandler = err => {
				reject(err);
				workerReset(nextAvailableWorker);
			};

			let exitHandler = code => {
				if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
				workerReset(nextAvailableWorker);
			};

			let workerReset = workerObject => {
				workerObject.working = false;
				workerObject.worker.removeListener('message', messageHandler);
				workerObject.worker.removeListener('error', errorHandler);
				workerObject.worker.removeListener('exit', exitHandler);
			};

			worker.on('message', messageHandler);
			worker.on('error', errorHandler);
			worker.on('exit', exitHandler);

			worker.postMessage(workerData);
		});
	}
}

module.exports = WorkerPool;