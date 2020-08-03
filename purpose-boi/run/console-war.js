'use strict';

let Game = require('./../game.js');
let Cache = require('./../cache.js');
let AI = require('./../ai.js');
let Util = require('./../util.js');

let args = process.argv.slice(2);
let width = parseInt(args[0]);
let height = parseInt(args[1]);
let winLength = parseInt(args[2]);
let player = parseInt(args[3]);

let depth = 8;

if (isNaN(width) || isNaN(height) || isNaN(winLength) || isNaN(player)) {process.exit(1)}

let winMask = Game.createWinMask(width, height, winLength);
let cache = new Cache();
let ai = new AI(winMask);

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('readable', async function() {
	let flatField = process.stdin.read().replace(/\r?\n|\r/g, '').split('').map(item => parseInt(item));

	if (flatField.length != width * height) {return}

	let field = [];
	for (var x = 0; x < width; x++) {
		field[x] = flatField.slice(x * height, (x + 1) * height);
	}

	let data = (await ai.start(field, player, depth)).map(result => 
		result ? 
			result
			:
			(player == 1 ? {p1Wins: 0, p2Wins: 9999999, und: 0} : {p1Wins: 9999999, p2Wins: 0, und: 0})
	);
	let processed = data.map(item => {
		let total = item.p1Wins + item.p2Wins + item.und;
		let playerWins = player == 1 ? item.p1Wins : item.p2Wins;

		if (total == 0) {
			return -999999;
		}

		if (total == playerWins) {
			return 1 + (1 / playerWins);
		}

		return playerWins / total;
	});
	let max = Math.max(...processed);
	let col = processed.indexOf(max);

	console.log(col);
	process.stdin.resume();
});