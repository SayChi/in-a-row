'use strict';

let S = require('./settings.js');

class Cache {
	constructor(cache = {}) {
		if (Cache.instance) {
			return Cache.instance;
		}

		this.cache = cache;
		Cache.instance = this;
	}

	static createCacheKey(field) {
		return "".concat(...field.map(col => "".concat(...col)));
	}

	getFromCache(field) {
		if (!S.useCache) {return undefined}

		let key = Cache.createCacheKey(field);

		return this.cache[key];
	}

	addToCache(field, value) {
		if (!S.useCache) {return}

		let key = Cache.createCacheKey(field);

		this.cache[key] = value;
	}

	clearCache(force = false) {
		if (force) {
			this.cache = {};
			return;
		}

		Object.keys(this.cache).forEach(key => {
			if (this.cache[key].und != 0) {
				delete this.cache[key];
			}
		});
	}
}

module.exports = Cache;