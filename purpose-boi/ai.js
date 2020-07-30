'use strict';

let Cache = require('./cache.js');
let Counters = require('./counters.js');
let Util = require('./util.js');
let Game = require('./game.js');
let S = require('./settings.js');

class AI {
	constructor(winMask) {
		this.winMask = winMask;
	}

	buildPredictionTree(field, player, depth) {

		let cache = new Cache();
		let counters = new Counters();

		counters.stepCounter++;
		let moves = Util.createNextMoveSet(field, player);

		moves = moves.map(move => {
			let cachedItem = cache.getFromCache(move);
			if (cachedItem) {
				counters.cachePruneCounter++;
				return cachedItem;
			}

			let p1Wins = Game.checkWin(move, this.winMask, 1);
			let p2Wins = Game.checkWin(move, this.winMask, 2);

			if (p1Wins) {
				cache.addToCache(move, {p1Wins: 1, p2Wins: 0, und: 0});
				return {p1Wins: 1, p2Wins: 0, und: 0};
			}
			if (p2Wins) {
				cache.addToCache(move, {p1Wins: 0, p2Wins: 1, und: 0});
				return {p1Wins: 0, p2Wins: 1, und: 0};
			}
			if (depth == 0) {
				cache.addToCache(move, {p1Wins: 0, p2Wins: 0, und: 1});
				return {p1Wins: 0, p2Wins: 0, und: 1};
			}

			return move;
		});

		let p1WinCount = moves.filter(move => !Array.isArray(move) && move.p1Wins == 1).length;
		let p2WinCount = moves.filter(move => !Array.isArray(move) && move.p2Wins == 1).length;

		if (player == 1 && p1WinCount >= 1) {
			counters.p1PruneCounter++;
			return {p1Wins: S.width, p2Wins: 0, und: 0}
		}
		if (player == 1 && p2WinCount >= 2) {
			counters.p1LossPruneCounter++;
			return {p1Wins: 0, p2Wins: S.width, und: 0}
		}
		if (player == 2 && p2WinCount >= 1) {
			counters.p2PruneCounter++;
			return {p1Wins: 0, p2Wins: S.width, und: 0}
		}
		if (player == 2 && p1WinCount >= 2) {
			counters.p2LossPruneCounter++;
			return {p1Wins: S.width, p2Wins: 0, und: 0}
		}

		moves = moves.map(move => {
			if (Array.isArray(move)) {
				return this.buildPredictionTree(move, player == 1 ? 2 : 1, depth - 1);
			}else {
				return move;
			}
		});

		let result = moves.reduce((acc, cur) => 
			({
				p1Wins: acc.p1Wins + cur.p1Wins,
				p2Wins: acc.p2Wins + cur.p2Wins,
				und: acc.und + cur.und
			})
		, {p1Wins: 0, p2Wins: 0, und: 0});
		cache.addToCache(field, result);
		return result;
	}
}

module.exports = AI;