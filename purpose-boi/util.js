'use strict';

let S = require('./settings.js');
let Game = require('./game.js');
let Cache = require('./cache.js');

class Util {
	static createNextMoveSet(field, player, forceFill = false) {
		let moves = [];

		for (let i = 0; i < S.width; i++) {
			try {
				let fieldClone = [];
				field.forEach(col => fieldClone.push([...col]));

				let newField = require('./game.js').throwCoin(fieldClone, i, player);

				moves.push(newField);
			}catch{
				if (forceFill) {moves.push(null)}
			}
		}

		return moves;
	}

	static displayField(field) {
		for (let y = S.height - 1; y >= 0; y--) {
			console.log("".concat(...field.map(col => col[y] + " ")) + "    " + y);
		}

		console.log("");
		console.log("".concat(..."a".repeat(S.width).split("").map((item, index) => index + " ")));
		console.log("");
		console.log("");
	}
}

module.exports = Util;