'use strict';

let {spawn} = require('child_process');
let {Readable} = require('stream');

let args = process.argv.slice(2);
let width = 0 in args ? parseInt(args[0]) : 7;
let height = 1 in args ? parseInt(args[1]) : 6;
let winLength = 2 in args ? parseInt(args[2]) : 4;
let ai1 = 3 in args ? args[3] : 'js';
let ai2 = 4 in args ? args[4] : 'js';

let initialField = "0".repeat(width * height);

let p1, p2;
let fieldManager;
let startTime, endTime;

fieldManager = spawn('node', ['run/field-manager.js', width, height, winLength], {cwd: './../purpose-boi'});

switch(ai1) {
	case 'js': {
		p1 = spawn('node', ['run/console-war.js', width, height, winLength, 1], {cwd: './../purpose-boi'});
	}
}

switch(ai2) {
	case 'js': {
		p2 = spawn('node', ['run/console-war.js', width, height, winLength, 2], {cwd: './../purpose-boi'});
	}
}

p1.stdout.on('readable', getResponseProcessor(p1));
p2.stdout.on('readable', getResponseProcessor(p2));
fieldManager.stdout.on('readable', fieldManagerProcessor);

send(p1, initialField);

function send(process, message) {
	let stream = Readable.from(message);
	stream.on('readable', () => {
		process.stdin.write(stream.read());
		startTime = (new Date()).getTime();
	});
}

function getResponseProcessor(fromPlayer) {
	return () => {
		let buffer = fromPlayer.stdout.read();
		if (!buffer) {return}

		endTime = (new Date()).getTime();
		console.log(`Took ${(endTime - startTime) / 1000}s`);

		let response = buffer.toString().replace(/\r?\n|\r/g, '');
		console.log(`Column ${response}`);

		send(fieldManager, response);
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

function fieldManagerProcessor() {
	let buffer = fieldManager.stdout.read();
	if (!buffer) {return}

	let response = buffer.toString().replace(/\r?\n|\r/g, '');
	
	switch(response) {
		case "winner p1":
			console.log("winner p1");
			break;

		case "winner p2":
			console.log("winner p2");
			break;

		case "tie":
			console.log("tie");
			break;

		default:
			printField(response);

			let count1s = (response.match(/1/g) || []).length;
			let count2s = (response.match(/2/g) || []).length;
			let player2Turn = count1s > count2s;
			let p = player2Turn ? p2 : p1;

			send(p, response);

			break;
	}
}