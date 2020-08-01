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

p1.stdout.on('readable', function() {
	let buffer = p1.stdout.read();
	if (!buffer) {return}

	let response = buffer.toString();
	console.log(response);

	sendToP2(response);
});

p2.stdout.on('readable', function() {
	let buffer = p2.stdout.read();
	if (!buffer) {return}

	let response = buffer.toString();
	console.log(response);

	sendToP1(response);
});

sendToP1("0".repeat(width * height));

function sendToP1(message) {
	let stream = Readable.from(message);
	stream.on('readable', () => p1.stdin.write(stream.read()));
}

function sendToP2(message) {
	let stream = Readable.from(message);
	stream.on('readable', () => p2.stdin.write(stream.read()));
}