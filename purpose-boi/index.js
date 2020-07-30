'use strict';

let searchDepth = 8;
let width = 7;
let height = 6;
let winLength = 4;
let winDirs = [
	{x: 1, y: 0},
	{x: 1, y: 1},
	{x: 0, y: 1},
	{x: -1, y: 1}
];
let useCache = true;

let cache = {};

let stepCounter;
let p1PruneCounter;
let p2PruneCounter;
let p1LossPruneCounter;
let p2LossPruneCounter;
let cachePruneCounter;

function createField() {
	let field = new Array(width);
	field.fill(new Array(height));
	field.map(row => row.fill(0));

	return field;
}

function createWinMask() {
	let winMask = [];

	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			for (var i = 0; i < winDirs.length; i++) {
				let winDir = winDirs[i];
				let winRow = [];

				for (var d = 0; d < winLength; d++) {
					let dx = d * winDir.x;
					let dy = d * winDir.y;

					let x2 = x + dx;
					let y2 = y + dy;

					if (0 > x2 || x2 > width - 1 || 0 > y2 || y2 > height - 1) {break;}

					winRow.push({x: x2, y: y2});
				}

				if (winRow.length == winLength) {
					winMask.push(winRow);
				}
			}
		}
	}

	return winMask;
}

function throwCoin(field, col, player) {
	let fieldClone = [];
	field.forEach(col => fieldClone.push([...col]));

	let amountInCol = fieldClone[col].filter(item => item > 0).length;

	if (amountInCol > height - 1) {throw new Error('Col full')}

	fieldClone[col][amountInCol] = player;

	return fieldClone;
}

function checkWin(field, winMask, player) {
	let win = false;

	winMask.forEach(winRow => {
		for (var j = 0; j < winRow.length; j++) {
			let {x, y} = winRow[j];

			if (field[x][y] != player) {break}

			if (j == winLength - 1) {
				win = true;
			}
		}
	});

	return win;
}

function buildPredictionTree(field, winMask, player, depth = searchDepth) {
	stepCounter++;
	let moves = createNextMoveSet(field, player);

	moves = moves.map(move => {
		let cachedItem = getFromCache(move);
		if (cachedItem) {
			cachePruneCounter++;
			return cachedItem;
		}

		let p1Wins = checkWin(move, winMask, 1);
		let p2Wins = checkWin(move, winMask, 2);

		if (p1Wins) {
			addToCache(move, {p1Wins: 1, p2Wins: 0, und: 0});
			return {p1Wins: 1, p2Wins: 0, und: 0};
		}
		if (p2Wins) {
			addToCache(move, {p1Wins: 0, p2Wins: 1, und: 0});
			return {p1Wins: 0, p2Wins: 1, und: 0};
		}
		if (depth == 0) {
			addToCache(move, {p1Wins: 0, p2Wins: 0, und: 1});
			return {p1Wins: 0, p2Wins: 0, und: 1};
		}

		return move;
	});

	let p1WinCount = moves.filter(move => !Array.isArray(move) && move.p1Wins == 1).length;
	let p2WinCount = moves.filter(move => !Array.isArray(move) && move.p2Wins == 1).length;

	if (player == 1 && p1WinCount >= 1) {
		p1PruneCounter++;
		return {p1Wins: width, p2Wins: 0, und: 0}
	}
	if (player == 1 && p2WinCount >= 2) {
		p1LossPruneCounter++;
		return {p1Wins: 0, p2Wins: width, und: 0}
	}
	if (player == 2 && p2WinCount >= 1) {
		p2PruneCounter++;
		return {p1Wins: 0, p2Wins: width, und: 0}
	}
	if (player == 2 && p1WinCount >= 2) {
		p2LossPruneCounter++;
		return {p1Wins: width, p2Wins: 0, und: 0}
	}

	moves = moves.map(move => {
		if (Array.isArray(move)) {
			return buildPredictionTree(move, winMask, player == 1 ? 2 : 1, depth - 1);
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
	addToCache(field, result);
	return result;
}

function createNextMoveSet(field, player, forceFill = false) {
	let moves = [];

	for (let i = 0; i < width; i++) {
		try {
			let fieldClone = [];
			field.forEach(col => fieldClone.push([...col]));

			let newField = throwCoin(fieldClone, i, player);

			moves.push(newField);
		}catch{
			if (forceFill) {moves.push(null)}
		}
	}

	return moves;
}

function createCacheKey(field) {
	return "".concat(...field.map(col => "".concat(...col)));
}

function getFromCache(field) {
	if (!useCache) {return undefined}

	let key = createCacheKey(field);

	return cache[key];
}

function addToCache(field, value) {
	if (!useCache) {return}

	let key = createCacheKey(field);

	cache[key] = value;
}

function startGame(p1Bot = false, p2Bot = true, depth = searchDepth) {
	searchDepth = depth;

	let field = createField();
	let winMask = createWinMask();

	displayField(field);

	let p1Turn = true;
	while(!(checkWin(field, winMask, 1) || checkWin(field, winMask, 2))) {
		cache = {};
		
		if (p1Turn) {
			if (p1Bot) {
				let nextMoveSet = createNextMoveSet(field, 1, true);
				let data = nextMoveSet.map(move => move ? buildPredictionTree(move, winMask, 2) : {p1Wins: 0, p2Wins: 9999999, und: 0});
				let processed = data.map(item => item.p1Wins / (item.p1Wins + item.p2Wins + item.und));
				let max = Math.max(...processed);
				let col = processed.indexOf(max);
				field = throwCoin(field, col, 1);
			}else {
				field = throwCoin(field, parseInt(window.prompt("What col?")), 1);
			}
		}else {
			if (p2Bot) {
				let nextMoveSet = createNextMoveSet(field, 2, true);
				let data = nextMoveSet.map(move => move ? buildPredictionTree(move, winMask, 1) : {p1Wins: 9999999, p2Wins: 0, und: 0});
				let processed = data.map(item => item.p2Wins / (item.p1Wins + item.p2Wins + item.und));
				let max = Math.max(...processed);
				let col = processed.indexOf(max);
				field = throwCoin(field, col, 2);
			}else {
				field = throwCoin(field, parseInt(window.prompt("What col?")), 2);
			}
		}

		p1Turn = !p1Turn;
		displayField(field);
	}
}

function displayField(field) {
	for (let y = height - 1; y >= 0; y--) {
		console.log("".concat(...field.map(col => col[y] + " ")) + "    " + y);
	}

	console.log("");
	console.log("".concat(..."a".repeat(width).split("").map((item, index) => index + " ")));
	console.log("");
	console.log("");
}

function benchmark(depth = searchDepth) {
	searchDepth = depth;

	let field = createField();
	let winMask = createWinMask();

	cache = {};
	stepCounter = 0;
	p1PruneCounter = 0;
	p2PruneCounter = 0;
	p1LossPruneCounter = 0;
	p2LossPruneCounter = 0;
	cachePruneCounter = 0;

	let startTime = (new Date()).getTime();
	let data = buildPredictionTree(field, winMask, 1);
	let endTime = (new Date()).getTime();

	Object.assign(data, {
		'run-time': (endTime - startTime) / 1000,
		'steps': stepCounter,
		'p1-prunes': p1PruneCounter,
		'p2-prunes': p2PruneCounter,
		'p1-loss-prunes': p1LossPruneCounter,
		'p2-loss-prunes': p2LossPruneCounter,
		'cache-prunes': cachePruneCounter,
	});
	
	return data;
}

function depthBenchmark(maxDepth) {
	let allData = [];

	for(let depth = 1; depth <= maxDepth; depth++) {
		console.log(`---- DEPTH TEST AT ${depth} ----`);
		let data = benchmark(depth);
		console.table(data);
		allData[depth] = data;
	}

	console.log(`---- ALL ----`);
	console.table(allData);
}

depthBenchmark(8);