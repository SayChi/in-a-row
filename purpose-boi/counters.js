'use strict';

class Counters {
	constructor() {
		if (Counters.instance) {
			return Counters.instance;
		}

		Counters.instance = this;

		this.clear();
	}

	clear() {
		this.stepCounter = 0;
		this.p1PruneCounter = 0;
		this.p2PruneCounter = 0;
		this.p1LossPruneCounter = 0;
		this.p2LossPruneCounter = 0;
		this.cachePruneCounter = 0;
	}

	getAll() {
		return {
			stepCounter: this.stepCounter,
			p1PruneCounter: this.p1PruneCounter,
			p2PruneCounter: this.p2PruneCounter,
			p1LossPruneCounter: this.p1LossPruneCounter,
			p2LossPruneCounter: this.p2LossPruneCounter,
			cachePruneCounter: this.cachePruneCounter,
		}
	}
}

module.exports = Counters;