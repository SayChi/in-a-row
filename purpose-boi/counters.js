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
}

module.exports = Counters;