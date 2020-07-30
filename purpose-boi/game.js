'use strict';

let S = require('./settings.js');
let Util = require('./util.js');
let Cache = require('./cache.js');
let AI = require('./ai.js');

class Game {
	constructor(depth, p1Bot, p2Bot) {
		if (Game.instance) {
			return Game.instance;
		}

		Game.instance = this;

		this.depth = depth;
		this.p1Bot = p1Bot;
		this.p2Bot = p2Bot;
	}

	static createField() {
		let field = new Array(S.width);
		field.fill(new Array(S.height));
		field.map(row => row.fill(0));

		return field;
	}

	static createWinMask() {
		let winMask = [];

		for (var x = 0; x < S.width; x++) {
			for (var y = 0; y < S.height; y++) {
				for (var i = 0; i < S.winDirs.length; i++) {
					let winDir = S.winDirs[i];
					let winRow = [];

					for (var d = 0; d < S.winLength; d++) {
						let dx = d * winDir.x;
						let dy = d * winDir.y;

						let x2 = x + dx;
						let y2 = y + dy;

						if (0 > x2 || x2 > S.width - 1 || 0 > y2 || y2 > S.height - 1) {break;}

						winRow.push({x: x2, y: y2});
					}

					if (winRow.length == S.winLength) {
						winMask.push(winRow);
					}
				}
			}
		}

		return winMask;
	}

	static throwCoin(field, col, player) {
		let fieldClone = [];
		field.forEach(col => fieldClone.push([...col]));

		let amountInCol = fieldClone[col].filter(item => item > 0).length;

		if (amountInCol > S.height - 1) {throw new Error('Col full')}

		fieldClone[col][amountInCol] = player;

		return fieldClone;
	}

	async play(p1Bot = this.p1Bot, p2Bot = this.p2Bot, depth = this.depth) {
		let field = this.constructor.createField();
		let winMask = this.constructor.createWinMask();

		Util.displayField(field);

		let p1Turn = true;
		while(!(Util.checkWin(field, winMask, 1) || Util.checkWin(field, winMask, 2))) {
			new Cache().clearCache();
			
			if (p1Turn) {
				if (p1Bot) {
					let nextMoveSet = Util.createNextMoveSet(field, 1, true);
					let data = nextMoveSet.map(move => move ? new AI(winMask).buildPredictionTree(move, 2, depth) : {p1Wins: 0, p2Wins: 9999999, und: 0});
					let processed = data.map(item => item.p1Wins / (item.p1Wins + item.p2Wins + item.und));
					let max = Math.max(...processed);
					let col = processed.indexOf(max);
					field = this.constructor.throwCoin(field, col, 1);
				}else {
					let col = await Util.consoleQuestion("What col?\n").catch(console.log);
					field = this.constructor.throwCoin(field, parseInt(col), 1);
				}
			}else {
				if (p2Bot) {
					let nextMoveSet = Util.createNextMoveSet(field, 2, true);
					let data = nextMoveSet.map(move => move ? new AI(winMask).buildPredictionTree(move, 1, depth) : {p1Wins: 9999999, p2Wins: 0, und: 0});
					let processed = data.map(item => item.p2Wins / (item.p1Wins + item.p2Wins + item.und));
					let max = Math.max(...processed);
					let col = processed.indexOf(max);
					field = this.constructor.throwCoin(field, col, 2);
				}else {
					let col = await Util.consoleQuestion("What col?\n").catch(console.log);
					field = this.constructor.throwCoin(field, parseInt(col), 2);
				}
			}

			p1Turn = !p1Turn;
			Util.displayField(field);
		}
	}
}

module.exports = Game;