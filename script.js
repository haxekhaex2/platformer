import WorldScene from "./WorldScene.js";

var config = {
	type: Phaser.CANVAS,
	backgroundColor: 0xeeeeee,
	physics: {
		default: "arcade",
		arcade: {
			gravity: {y: 2048},
			debug: true,
			overlapBias: 32
		}
	},
	scene: window.world = new WorldScene(),
	render: {
		antialias: false
	},
	canvas: document.getElementById("canvas")
};

/* Globals. */
let game = new Phaser.Game(config);
window.game = game;

let spawnMode;
