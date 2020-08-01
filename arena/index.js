'use strict';

let {spawn} = require('child_process');
let {Readable, Writable, Stream} = require('stream');

let args = process.argv.slice(2);
let width = parseInt(args[0]);
let height = parseInt(args[1]);
let winLength = parseInt(args[2]);
let ai1 = args[3];
let ai2 = args[4];

let initialField = "0".repeat(width * height);

let p1 = spawn('node', ['run/console-war.js', width, height, winLength, 1], {cwd: './../purpose-boi'});
let p2 = spawn('node', ['run/console-war.js', width, height, winLength, 2], {cwd: './../purpose-boi'});

p1.stdout.on('readable', getResponseProcessor(p1, p2));

p2.stdout.on('readable', getResponseProcessor(p2, p1));

send(p1, initialField);

function send(player, message) {
	let stream = Readable.from(message);
	stream.on('readable', () => player.stdin.write(stream.read()));
}

function getResponseProcessor(fromPlayer, toPlayer) {
	return () => {
		let buffer = fromPlayer.stdout.read();
		if (!buffer) {return}

		let response = buffer.toString().replace(/\r?\n|\r/g, '');
		printField(response);

		send(toPlayer, response);
	}
}

function printField(serialFieldString) {
	let flatField = serialFieldString.split('').map(item => parseInt(item));
	let field = [];
	for (var x = 0; x < width; x++) {
		field[x] = flatField.slice(x * height, (x + 1) * height);
	}
	
	for (let y = field[0].length - 1; y >= 0; y--) {
		console.log("".concat(...field.map(col => col[y] + " ")));
	}
	
	console.log("");
}