'use strict';

let S = require('./settings.js');
let Game = require('./game.js');
let Cache = require('./cache.js');
let readline = require('readline');
let {Worker} = require('worker_threads');

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

	static consoleQuestion(q) {
		let rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		return new Promise(resolve => rl.question(q, ans => {
			rl.close();
			resolve(ans);
		}));
	}

	static checkWin(field, winMask, player) {
		let win = false;

		winMask.forEach(winRow => {
			for (var j = 0; j < winRow.length; j++) {
				let {x, y} = winRow[j];

				if (field[x][y] != player) {break}

				if (j == S.winLength - 1) {
					win = true;
				}
			}
		});

		return win;
	}

	static runWorker(workerData) {
		return new Promise((resolve, reject) => {
			let worker = new Worker('./worker.js', {workerData});
			worker.on('message', resolve);
			worker.on('error', reject);
			worker.on('exit', (code) => {
				if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
			})
		});
	}
}

module.exports = Util;