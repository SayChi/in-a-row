'use strict';

let Game = require('./../game.js');
let Cache = require('./../cache.js');
let Util = require('./../util.js');

let args = process.argv.slice(2);
let width = parseInt(args[0]);
let height = parseInt(args[1]);
let winLength = parseInt(args[2]);

let field = Game.createField(width, height);
let winMask = Game.createWinMask(width, height, winLength);

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
	let col = process.stdin.read().replace(/\r?\n|\r/g, '');
	let count1s = field.reduce((acc, cur) => acc + cur.filter(item => item == 1).length, 0);
	let count2s = field.reduce((acc, cur) => acc + cur.filter(item => item == 2).length, 0);
	let player2Turn = count1s > count2s;

	field = Game.throwCoin(field, col, player2Turn ? 2 : 1);

	if (Util.checkWin(field, winMask, 1)) {
		console.log("winner p1");
	}else if (Util.checkWin(field, winMask, 2)) {
		console.log("winner p2");
	}else if (field.reduce((acc, cur) => acc + cur.filter(item => item == 0).length, 0) == 0) {
		console.log("tie");
	}else {
		console.log(Cache.createCacheKey(field));
	}

	process.stdin.resume();
});