'use strict';

let Game = require('./../game.js');

let args = process.argv.slice(2);

new Game(
	0 in args ? parseInt(args[0]) : 6, 
	1 in args ? args[1] == "true" : true, 
	2 in args ? args[2] == "true" : true
).play();